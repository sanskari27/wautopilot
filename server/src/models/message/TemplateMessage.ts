import Template from '../templates/template';

type TextHeader = {
	type: 'header';
	parameters: {
		type: 'text';
		text: string;
	}[];
};

type MediaType = 'image' | 'video' | 'document';

type MediaHeader = {
	parameters: {
		type: MediaType;
		image?: {
			link?: string;
			media_id?: string;
		};
		video?: {
			link?: string;
			media_id?: string;
		};
		document?: {
			link?: string;
			media_id?: string;
		};
	}[];
	type: 'header';
};

type Header = TextHeader | MediaHeader;

export default class TemplateMessage {
	private template: Template;

	private header?: Header;

	constructor(template: Template) {
		this.template = template;
	}

	setTextHeader(variables: string[]) {
		this.header = {
			type: 'header',
			parameters: variables.map((text) => ({
				type: 'text',
				text,
			})),
		};
		return this;
	}

	setMediaHeader(media: { media_id: string } | { link: string }) {
		const format = this.template.getHeader()?.format;
		if (!format || format === 'TEXT') {
			throw new Error('Header is already a text header');
		}
		this.header = {
			type: 'header',
			parameters: [
				{
					type: format.toLowerCase() as MediaType,
					[format]: media,
				},
			],
		};
		return this;
	}
}
