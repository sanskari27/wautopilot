import Template from '../templates/template';
import Message from './message';

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

type Body = {
	type: 'body';
	parameters: string[];
};

type Button = {
	type: 'button';
	sub_type: 'url';
	index: number;
	parameters: {
		type: 'text';
		text: string;
	}[];
};

export default class TemplateMessage extends Message {
	private template: Template;

	private header?: Header;
	private body?: Body;
	private buttons?: Button[];

	constructor(recipient: string, template: Template) {
		super(recipient);
		this.template = template;
	}

	setTextHeader(variables: string[]) {
		if (variables.length === 0) {
			return this;
		}
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
		if (!('media_id' in media) && !('link' in media)) {
			return this;
		}

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

	setBody(variables: string[]) {
		if (variables.length === 0) {
			return this;
		}
		this.body = {
			type: 'body',
			parameters: variables,
		};
		return this;
	}

	setButtons(buttons: string[][]) {
		if (buttons.length === 0) {
			return this;
		}
		this.buttons = buttons.map((button, index) => ({
			type: 'button',
			sub_type: 'url',
			index,
			parameters: button.map((text) => ({
				type: 'text',
				text,
			})),
		}));
		return this;
	}

	toObject() {
		return {
			messaging_product: 'whatsapp',
			context: this.context,
			to: this.recipient,
			recipient_type: 'individual',
			type: 'template',
			template: {
				name: this.template.getName(),
				language: {
					code: 'en_US',
				},
				components: [
					...(this.header ? [this.header] : []),
					...(this.body ? [this.body] : []),
					...(this.buttons ? this.buttons : []),
				],
			},
		};
	}
}
