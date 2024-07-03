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

export function extractInteractiveButtons(components: Record<string, any>) {
	const buttons =
		(components.action.buttons as {
			type: string;
			reply: {
				id: string;
				title: string;
			};
		}[]) ?? [];

	return buttons.map((button) => ({
		button_type: 'QUICK_REPLY' as 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER',
		button_content: button.reply.title,
		button_data: button.reply.id,
	}));
}

export function generateHeader(type: 'image' | 'video' | 'document', media_id: string) {
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

export function convertToId(text: string) {
	return text.replace(/\s/g, '-').toLowerCase();
}
