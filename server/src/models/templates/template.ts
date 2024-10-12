export type HeaderTemplate = TextHeader | MediaHeader;

export type TextHeader = {
	format: 'TEXT';
	text: string;
	example: string[];
};

export type MediaHeader = {
	format: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
	example: string;
};

export type Body = {
	text: string;
	example: string[];
};

export type CarouselHeader = {
	format: 'IMAGE' | 'VIDEO';
	example: string;
};

export type Carousel = {
	cards: {
		header: CarouselHeader;
		body: Body;
		buttons: ButtonsTemplate;
	}[];
};

export type Footer = {
	text: string;
};

export type ReplyButton = {
	type: 'QUICK_REPLY';
	text: string;
};

export type URLButton = {
	type: 'URL';
	text: string;
	url: string;
	example: string[];
};

export type PhoneButton = {
	type: 'PHONE_NUMBER';
	text: string;
	phone_number: string;
};

export type FlowButton = {
	type: 'FLOW';
	text: string;
	flow_id: string;
	flow_action: 'navigate' | 'data_exchange';
	navigate_screen: string;
};

export type ButtonsTemplate = (ReplyButton | URLButton | PhoneButton | FlowButton)[];

export const DEFAULT_TEMPLATE_LANGUAGE = 'en_US';
export default class Template {
	private id?: string;
	private name?: string;
	private status?: 'APPROVED' | 'PENDING' | 'REJECTED';
	private category?: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';

	private header?: HeaderTemplate;
	private body?: Body;
	private carousel?: Carousel;
	private footer?: Footer;
	private buttons?: ButtonsTemplate;

	constructor(data?: {
		id: string;
		name: string;
		status: 'APPROVED' | 'PENDING' | 'REJECTED';
		category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
		header: HeaderTemplate;
		body: Body;
		footer: Footer;
		buttons: ButtonsTemplate;
		carousel: Carousel;
	}) {
		if (data) {
			this.id = data.id;
			this.name = data.name;
			this.status = data.status;
			this.category = data.category;
			this.header = data.header;
			this.body = data.body;
			this.footer = data.footer;
			this.buttons = data.buttons;
			this.carousel = data.carousel;
		}
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	setId(id: string) {
		this.id = id;
		return this;
	}

	setName(name: string) {
		this.name = name;
		return this;
	}

	setStatus(status: 'APPROVED' | 'PENDING' | 'REJECTED') {
		this.status = status;
		return this;
	}

	setCategory(category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY') {
		this.category = category;
		return this;
	}

	setHeader(header: HeaderTemplate) {
		this.header = header;
		return this;
	}

	setBody(body: Body) {
		this.body = body;
		return this;
	}

	setFooter(footer: Footer) {
		this.footer = footer;
		return this;
	}

	setButtons(buttons: ButtonsTemplate) {
		this.buttons = buttons;
		return this;
	}
	setCarousel(carousel: Carousel) {
		this.carousel = carousel;
		return this;
	}

	toObject() {
		return {
			id: this.id,
			name: this.name,
			status: this.status,
			category: this.category,
			header: this.header,
			body: this.body,
			footer: this.footer,
			buttons: this.buttons,
			carousel: this.carousel,
		};
	}

	getStatus() {
		return this.status;
	}

	getHeader() {
		return this.header;
	}

	buildToSave() {
		let header = {};
		let body = {};
		let footer = {};
		let carousel = {};
		let buttons = {};

		if (this.header) {
			if (this.header.format === 'TEXT') {
				const exampleLength = this.header.example.length;
				header = {
					type: 'HEADER',
					format: this.header.format,
					text: this.header.text,
					...(exampleLength > 0 && {
						example: {
							header_text: this.header.example,
						},
					}),
				};
			} else {
				header = {
					type: 'HEADER',
					format: this.header.format,
					[this.header.format.toLowerCase()]: {
						header_handle: [this.header.example],
					},
				};
			}
		}

		if (this.body) {
			const exampleLength = this.body.example.length;
			body = {
				type: 'BODY',
				text: this.body.text,
				...(exampleLength > 0 && {
					example: {
						body_text: [this.body.example],
					},
				}),
			};
		}

		if (this.footer) {
			footer = {
				type: 'FOOTER',
				text: this.footer.text,
			};
		}
		if (this.carousel) {
			carousel = {
				type: 'CAROUSEL',
				cards: this.carousel.cards.map((card) => {
					const exampleLength = card.body.example.length;
					const header = {
						type: 'HEADER',
						format: card.header.format,
						header_handle: [card.header.example],
					};
					const body = {
						type: 'BODY',
						text: card.body.text,
						...(exampleLength > 0 && {
							example: {
								body_text: [card.body.example],
							},
						}),
					};
					const buttons = card.buttons;
					return {
						components: [
							header,
							body,
							{
								type: 'BUTTONS',
								buttons: buttons,
							},
						],
					};
				}),
			};
		}

		if (this.buttons) {
			buttons = {
				type: 'BUTTONS',
				buttons: this.buttons,
			};
		}

		return {
			...(this.id ? { id: this.id } : {}),
			name: this.name,
			category: this.category,
			allow_category_change: true,
			language: DEFAULT_TEMPLATE_LANGUAGE,
			components: [
				...(this.header ? [header] : []),
				...(this.body ? [body] : []),
				...(this.footer ? [footer] : []),
				...(this.carousel ? [carousel] : []),

				...(this.buttons ? [buttons] : []),
			],
		};
	}
}
