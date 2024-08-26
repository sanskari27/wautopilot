import IContact from '../../mongo/types/contact';
import IPhoneBook from '../../mongo/types/phonebook';

export function extractTemplateHeader(
	components: Record<string, any>[],
	componentsMsg: Record<string, any>[]
) {
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

export function extractTemplateBody(
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

export function extractTemplateFooter(components: Record<string, any>[]) {
	const footer = components.find((component) => component.type === 'FOOTER');
	if (!footer) {
		return null;
	}
	return footer.text;
}

export function extractTemplateButtons(components: Record<string, any>[]) {
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

export function extractInteractiveHeader(components: Record<string, any>) {
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

export function extractInteractiveBody(components: Record<string, any>) {
	const body = components.body;
	if (!body) {
		return null;
	}

	return body.text;
}

export function extractInteractiveFooter(components: Record<string, any>) {
	const footer = components.footer;
	if (!footer) {
		return null;
	}

	return footer.text;
}

export function extractInteractiveButtons(components: Record<string, any>): {
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
			id: button.id,
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
		type: 'reply',
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
		return variables[variable] ?? '';
	});
}

export function generateTextMessageObject(recipient: string, msg: string) {
	return {
		messaging_product: 'whatsapp',
		to: recipient,
		type: 'text',
		text: {
			body: msg,
		},
	};
}

export function generateMediaMessageObject(
	recipient: string,
	details: { type: string; media_id: string }
) {
	return {
		messaging_product: 'whatsapp',
		to: recipient,
		type: details.type,
		[details.type]: {
			id: details.media_id,
		},
	};
}

export function generateContactMessageObject(recipient: string, card: IContact) {
	return {
		messaging_product: 'whatsapp',
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
	}
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
		to: recipient,
		template: {
			components: [...headers, body],
		},
	};
}
