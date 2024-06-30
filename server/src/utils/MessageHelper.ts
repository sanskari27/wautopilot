export function extractHeader(
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

export function extractBody(
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

export function extractFooter(components: Record<string, any>[]) {
	const footer = components.find((component) => component.type === 'FOOTER');
	if (!footer) {
		return null;
	}
	return footer.text;
}

export function extractButtons(components: Record<string, any>[]) {
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
