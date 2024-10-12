import IContact from '../../mongo/types/contact';
import IPhoneBook from '../../mongo/types/phonebook';
import { IPhonebookRecord } from '../services/phonebook';
import { generateText } from './ExpressUtils';

function extractTemplateHeader(
	components: Record<string, any>[],
	componentsMsg: Record<string, any>[]
) {
	if (!components || !componentsMsg) {
		return null;
	}

	const header = components.find((component) => component.type === 'HEADER');
	const headerMsg = componentsMsg.find((component) => component.type === 'HEADER');
	if (!header) {
		return null;
	}

	if (header.format === 'TEXT') {
		return {
			header_type: 'TEXT',
			header_content_source: 'TEXT',
			header_content: header.text,
		};
	} else if (
		header.format === 'IMAGE' ||
		header.format === 'VIDEO' ||
		header.format === 'DOCUMENT'
	) {
		if (!headerMsg || !headerMsg.parameters[0]) {
			return null;
		}
		const parameter = headerMsg.parameters[0];
		if (!parameter || !parameter[parameter.type.toLowerCase()]) {
			return null;
		}
		const source = parameter[parameter.type.toLowerCase()].id ? 'ID' : 'LINK';

		return {
			header_type: header.format,
			header_content_source: source,
			header_content: parameter[parameter.type.toLowerCase()][source.toLowerCase()],
		};
	}
	return null;
}

function extractTemplateBody(
	components: Record<string, any>[],
	componentsMsg: Record<string, any>[]
) {
	const body = components.find((component) => component.type === 'BODY');
	const bodyMsg = componentsMsg.find((component) => component.type === 'BODY');
	if (!body || !bodyMsg) {
		return null;
	}
	const parameters = bodyMsg.parameters as {
		type: string;
		text: string;
	}[];

	return parameters.reduce((acc, parameter, index) => {
		return acc.replace(`{{${index + 1}}}`, parameter.text);
	}, (body.text as string) ?? '');
}

function extractTemplateFooter(components: Record<string, any>[]) {
	const footer = components.find((component) => component.type === 'FOOTER');
	if (!footer) {
		return null;
	}
	return footer.text;
}

function extractTemplateButtons(components: Record<string, any>[]) {
	const buttons = components.find((component) => component.type === 'BUTTONS');
	if (!buttons || buttons.buttons.length === 0) {
		return null;
	}
	return buttons.buttons.map((button: any) => ({
		button_type: button.type,
		button_content: button.text,
		button_data: button.text || button.url || button.phone_number,
	}));
}

function extractInteractiveHeader(components: Record<string, any>) {
	const header = components.header;
	if (!header) {
		return null;
	}
	const type = header.type.toUpperCase();
	if (type === 'TEXT') {
		return {
			header_type: type,
			header_content_source: 'TEXT',
			header_content: header.text,
		};
	}
	return {
		header_type: type,
		header_content_source: 'ID',
		header_content: header[header.type].id,
	};
}

function extractInteractiveBody(components: Record<string, any>) {
	const body = components.body;
	if (!body) {
		return null;
	}

	return body.text;
}

function extractInteractiveFooter(components: Record<string, any>) {
	const footer = components.footer;
	if (!footer) {
		return null;
	}

	return footer.text;
}

function extractInteractiveButtons(components: Record<string, any>): {
	button_type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'CTA';
	button_content: string;
	button_data: string;
}[] {
	if (!components.action) {
		return [];
	}

	if (components.type === 'flow') {
		return [
			{
				button_type: 'CTA',
				button_content: components.action.parameters.flow_cta as string,
				button_data: components.action.parameters.flow_id as string,
			},
		];
	}
	if (!components.action.buttons) {
		return [];
	}

	const buttons =
		(components.action.buttons as {
			type: string;
			reply: {
				id: string;
				title: string;
			};
		}[]) ?? [];

	return buttons.map((button) => ({
		button_type: 'QUICK_REPLY',
		button_content: button.reply.title,
		button_data: button.reply.id,
	}));
}

export function generateHeader(type: 'image' | 'video' | 'document' | 'text', media_id: string) {
	return {
		header: {
			type: type,
			[type]: {
				id: media_id,
			},
		},
	};
}

export function generateBodyText(text: string) {
	if (!text) {
		return {};
	}
	return {
		body: {
			text: text,
		},
	};
}

export function generateSections(
	sections: {
		title: string;
		buttons: { id: string; text: string }[];
	}[]
) {
	return sections.map((section) => ({
		title: section.title,
		rows: section.buttons.map((button: { id: string; text: string }) => ({
			id: button.id ?? generateText(2),
			title: button.text,
		})),
	}));
}

export function generateButtons(
	buttons: {
		id: string;
		text: string;
	}[]
) {
	return buttons.map((button) => ({
		type: 'reply' as 'reply',
		reply: {
			id: button.id,
			title: button.text,
		},
	}));
}

export function generateListBody(data: { [key: string]: string }) {
	return {
		...(data.header ? { header: { type: 'text', text: data.header } } : {}),
		...(data.body ? { body: { text: data.body } } : {}),
		...(data.footer ? { footer: { text: data.footer } } : {}),
	};
}

export function convertToId(text: string, delimiter: string = '-') {
	return text.replace(/[0-9]/g, '').replace(/\s/g, delimiter).toLowerCase();
}

export function objectToMessageBody(object: { [key: string]: string }, separator: string = '\n') {
	return Object.entries(object)
		.map(([key, value]) => `${key}: ${value}`)
		.join(separator);
}

export function parseVariables(text: string, variables: { [key: string]: string }) {
	return text.replace(/{{(.*?)}}/g, (match, variable) => {
		return variables[variable] ?? `{{${variable}}}`;
	});
}

export function parseToBodyVariables({
	variables,
	fields,
}: {
	variables: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	fields: IPhonebookRecord;
}) {
	const bodyParametersList = [
		'first_name',
		'last_name',
		'middle_name',
		'phone_number',
		'email',
		'birthday',
		'anniversary',
	];

	return variables.map((b) => {
		if (b.variable_from === 'custom_text') {
			return b.custom_text;
		} else {
			if (!fields) {
				return b.fallback_value;
			}

			const fieldVal = (
				bodyParametersList.includes(b.phonebook_data)
					? fields[b.phonebook_data as keyof typeof fields]
					: fields.others[b.phonebook_data]
			) as string;

			if (typeof fieldVal === 'string') {
				return fieldVal || b.fallback_value;
			}
			// const field = fields[]
			return b.fallback_value;
		}
	});
}

export function generateTextMessageObject(
	recipient: string,
	msg: string,
	opts: { meta_message_id?: string } = {} as any
) {
	return {
		messaging_product: 'whatsapp',
		...(opts.meta_message_id ? { context: { message_id: opts.meta_message_id } } : {}),
		to: recipient,
		type: 'text',
		text: {
			body: msg,
		},
	};
}

export function generateMediaMessageObject(
	recipient: string,
	details: { type: string; media_id: string },
	opts: { meta_message_id?: string } = {} as any
) {
	return {
		messaging_product: 'whatsapp',
		to: recipient,
		...(opts.meta_message_id ? { context: { message_id: opts.meta_message_id } } : {}),
		type: details.type,
		[details.type]: {
			id: details.media_id,
		},
	};
}

export function generateContactMessageObject(
	recipient: string,
	card: IContact,
	opts: { meta_message_id?: string } = {} as any
) {
	return {
		messaging_product: 'whatsapp',
		...(opts.meta_message_id ? { context: { message_id: opts.meta_message_id } } : {}),
		to: recipient,
		type: 'contacts',
		contacts: [
			{
				addresses: card.addresses,
				birthday: card.birthday,
				emails: card.emails.map((email) => ({
					type: 'HOME',
					email: email.email,
				})),
				name: card.name,
				org: card.org,
				phones: card.phones.map((phone) => ({
					type: 'HOME',
					phone: phone.phone,
					wa_id: phone.wa_id,
				})),
				urls: card.urls.map((url) => ({
					type: 'HOME',
					url: url.url,
				})),
			},
		],
	};
}

export function generateTemplateMessageObject(
	recipient: string,
	details: {
		template_name: string;
		header?: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
			media_id?: string;
		};
		body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		contact?: IPhoneBook;
	},
	opts: { meta_message_id?: string } = {} as any
) {
	const bodyParametersList = [
		'first_name',
		'last_name',
		'middle_name',
		'phone_number',
		'email',
		'birthday',
		'anniversary',
	];

	let headers = [] as Record<string, unknown>[];

	if (details.header && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(details.header.type ?? '')) {
		const object = {
			...(details.header.media_id ? { id: details.header.media_id } : {}),
		};
		const header_type = details.header.type;

		headers = [
			{
				type: 'HEADER',
				parameters:
					header_type !== 'TEXT'
						? [
								{
									type: header_type,
									[header_type.toLowerCase()]: object,
								},
						  ]
						: [],
			},
		];
	}
	const body = {
		type: 'BODY',
		parameters: details.body.map((b) => {
			if (b.variable_from === 'custom_text') {
				return {
					type: 'text',
					text: b.custom_text,
				};
			} else {
				if (!details.contact) {
					return {
						type: 'text',
						text: b.fallback_value,
					};
				}

				const fieldVal = (
					bodyParametersList.includes(b.phonebook_data)
						? details.contact[b.phonebook_data as keyof typeof details.contact]
						: details.contact.others[b.phonebook_data]
				) as string;

				if (typeof fieldVal === 'string') {
					return {
						type: 'text',
						text: fieldVal || b.fallback_value,
					};
				}
				// const field = fields[]
				return {
					type: 'text',
					text: b.fallback_value,
				};
			}
		}),
	};
	return {
		template_name: details.template_name,
		...(opts.meta_message_id ? { context: { message_id: opts.meta_message_id } } : {}),
		to: recipient,
		template: {
			components: [...headers, body],
		},
	};
}

export function extractFormattedMessage(
	messageObject: any,
	opts?: {
		template?: any;
	}
): {
	header: {
		header_type: string;
		header_content_source: string;
		header_content: string;
	} | null;
	body: {
		body_type: 'TEXT' | 'MEDIA' | 'CONTACT' | 'LOCATION';
		text?: string;
		media_id?: string;
		contacts?: IContact[];
		location?: {
			latitude: string;
			longitude: string;
			name: string;
			address: string;
		};
	} | null;
	footer: string | null;
	buttons:
		| {
				button_type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY' | 'VOICE_CALL' | 'CTA';
				button_content: string;
				button_data: string;
		  }[]
		| null;
} {
	if (messageObject.type === 'template') {
		return {
			header: extractTemplateHeader(opts?.template.components, messageObject.components),
			body: {
				body_type: 'TEXT',
				text: extractTemplateBody(opts?.template.components, messageObject.components) ?? '',
			},
			footer: extractTemplateFooter(opts?.template.components),
			buttons: extractTemplateButtons(opts?.template.components),
		};
	} else if (messageObject.type === 'interactive') {
		return {
			header: extractInteractiveHeader(messageObject.components),
			body: {
				body_type: 'TEXT',
				text: extractInteractiveBody(messageObject.components),
			},
			footer: extractInteractiveFooter(messageObject.components),
			buttons: extractInteractiveButtons(messageObject.components),
		};
	} else {
		const body = {
			body_type:
				messageObject.type === 'text'
					? 'TEXT'
					: messageObject.type === 'contacts'
					? 'CONTACT'
					: messageObject.type === 'location'
					? 'LOCATION'
					: 'MEDIA',
			media_id: ['image', 'video', 'document', 'audio', 'MEDIA'].includes(messageObject.type)
				? messageObject[messageObject.type]?.id
				: undefined,
			text: messageObject.text?.body,
			contacts: messageObject.contacts,
			location: messageObject.location,
		} as {
			body_type: 'TEXT' | 'MEDIA' | 'CONTACT' | 'LOCATION';
			text: string;
			media_id: string;
			contacts: IContact[];
			location: {
				latitude: string;
				longitude: string;
				name: string;
				address: string;
			};
		};
		return {
			header: null,
			body,
			footer: null,
			buttons: null,
		};
	}
}

export type FormattedMessage = ReturnType<typeof extractFormattedMessage>;
