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

type URLButton = {
	type: 'button';
	sub_type: 'url';
	index: number;
	parameters: {
		type: 'text';
		text: string;
	}[];
};

export type ReplyButton = {
	type: 'button';
	sub_type: 'quick_reply';
	index: number;
	parameters: [
		{
			type: 'payload';
			payload: string;
		}
	];
};

type CarouselHeader = {
	type: 'header';
	parameters: [
		{
			type: 'image' | 'video';
			image?: {
				id: string;
			};
			video?: {
				id: string;
			};
		}
	];
};

type CarouselBody = {
	type: 'body';
	parameters: {
		type: 'text';
		text: string;
	}[];
};

export interface Carousel {
	type: 'carousel';
	cards: {
		card_index: number;
		components: (CarouselHeader | CarouselBody | URLButton | ReplyButton)[];
	}[];
}

export interface ParameterClass {
	type: string;
	'<MESSAGE_HEADER_FORMAT>'?: MessageHeaderFormat;
	payload?: string;
	text?: string;
}

export interface MessageHeaderFormat {
	id: string;
}

export default class TemplateMessage extends Message {
	private template: Template;

	private header?: Header;
	private body?: Body;
	private buttons?: URLButton[];
	private carousel?: Carousel;

	constructor(recipient: string, template: Template) {
		super(recipient);
		this.template = template;
	}

	setTextHeader(variables: string[]) {
		if (!variables || variables.length === 0) {
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
		if (!media || (!('media_id' in media) && !('link' in media))) {
			return this;
		}

		const format = this.template.getHeader()?.format;
		if (!format || format === 'TEXT') {
			throw new Error('Header is already a text header');
		}
		const mediaObj = 'media_id' in media ? { media_id: media.media_id } : { link: media.link };
		this.header = {
			type: 'header',
			parameters: [
				{
					type: format.toLowerCase() as MediaType,
					[format]: mediaObj,
				},
			],
		};
		return this;
	}

	setBody(variables: string[]) {
		if (!variables || variables.length === 0) {
			return this;
		}
		this.body = {
			type: 'body',
			parameters: variables,
		};
		return this;
	}

	setButtons(buttons: string[][]) {
		if (!buttons || buttons.length === 0) {
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

	setCarousel(
		cards: {
			header: {
				media_id: string;
			};
			body: string[];
			buttons: string[][];
		}[]
	) {
		const cCards = this.template.getCarouselCards();
		if (!cards || cards.length === 0 || cCards.length === 0) {
			return this;
		}

		this.carousel = {
			type: 'carousel',
			cards: cards.map((card, card_index) => {
				const selectedCard = cCards[card_index];
				const headerFormat = selectedCard.header.format === 'IMAGE' ? 'image' : 'video';
				const selectedCardButtons = selectedCard.buttons;
				const buttons = card.buttons.map((button, index) => {
					if (selectedCardButtons[index].type === 'QUICK_REPLY') {
						return {
							type: 'button',
							sub_type: 'quick_reply',
							index,
							parameters: [
								{
									type: 'payload',
									payload: selectedCardButtons[index].text,
								},
							],
						} as ReplyButton;
					} else {
						return {
							type: 'button',
							sub_type: 'url',
							index,
							parameters: button.map((text) => ({
								type: 'text',
								text,
							})),
						} as URLButton;
					}
				});
				return {
					card_index,
					components: [
						{
							type: 'header',
							parameters: [
								{
									type: headerFormat,
									[headerFormat]: {
										id: card.header.media_id,
									},
								},
							],
						},
						{
							type: 'body',
							parameters: card.body.map((body) => ({
								type: 'text',
								text: body,
							})),
						},
						...buttons,
					],
				};
			}),
		};
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
					...(this.carousel ? [this.carousel] : []),
				],
			},
		};
	}
}
