import Message from './message';

type TextHeader = {
	type: 'text';
	text: string;
};

type MediaType = 'image' | 'video' | 'document' | 'none';

type MediaHeader = {
	[media in MediaType]: { media_id: string } | { link: string };
} & {
	type: MediaType;
};

type Header = TextHeader | MediaHeader;

type Body = {
	text: string;
};

export type Footer = {
	text: string;
};

export type ReplyButton = {
	type: 'reply';
	reply: {
		id: string;
		title: string;
	};
};

export type Section = {
	title: string;
	rows: {
		id: string;
		title: string;
	}[];
};

export default class MediaMessage extends Message {
	private media_type: MediaType;

	private header?: Header;
	private body?: Body;
	private footer?: Footer;
	private buttons?: ReplyButton[];
	private sections?: Section[];
	private interactiveType: string;

	constructor(recipient: string, media_type: MediaType) {
		super(recipient);
		this.interactiveType = 'button';
		this.media_type = media_type;
	}

	setTextHeader(text: string) {
		if (!text) {
			return this;
		}
		this.header = {
			type: 'text',
			text,
		};
		return this;
	}

	setMediaHeader(media: { media_id: string } | { link: string }) {
		if (this.media_type === 'none') {
			return this;
		} else if (!('link' in media) && !('media_id' in media)) {
			return this;
		}
		this.header = {
			type: this.media_type,
			[this.media_type]: media,
		} as any;
		return this;
	}

	setBody(text: string) {
		if (!text) {
			return this;
		}
		this.body = {
			text,
		};
		return this;
	}

	setFooter(text: string) {
		if (!text) {
			return this;
		}
		this.footer = {
			text,
		};
	}

	setButtons(buttons: ReplyButton[]) {
		if (buttons.length === 0) {
			return this;
		}
		this.buttons = buttons;
		return this;
	}

	setSections(sections: Section[]) {
		if (sections.length === 0) {
			return this;
		}
		this.sections = sections;
		return this;
	}

	setInteractiveType(type: string) {
		if (!type) {
			return this;
		}
		this.interactiveType = type;
		return this;
	}

	toObject() {
		const action = this.sections
			? {
					button: 'Select an option',
					sections: this.sections,
			  }
			: this.buttons
			? {
					buttons: this.buttons,
			  }
			: undefined;

		return {
			messaging_product: 'whatsapp',
			to: this.recipient,
			type: 'interactive',
			interactive: {
				type: this.interactiveType,
				...(this.header ? { header: this.header } : {}),
				...(this.body ? { body: this.body } : {}),
				...(this.footer ? { footer: this.footer } : {}),
				...(action ? { action } : {}),
			},
			context: this.context,
		};
	}
}
