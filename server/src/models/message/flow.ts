import { generateText } from '../../utils/ExpressUtils';
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
	type: 'body';
	text: string;
};

export type Footer = {
	type: 'footer';
	text: string;
};
export default class FlowMessage extends Message {
	private flow_id?: string;
	private flow_cta?: string;
	private screen?: string;

	private header?: Header;
	private body?: Body;
	private footer?: Footer;

	private flow_token?: string;

	constructor(recipient: string) {
		super(recipient);
	}

	setFlowDetails(flow_id: string, flow_cta: string, screen: string) {
		this.flow_id = flow_id;
		this.flow_cta = flow_cta;
		this.screen = screen;
		return this;
	}

	setTextHeader(text: string) {
		this.header = {
			type: 'text',
			text,
		};
		return this;
	}

	// setMediaHeader(media: { media_id: string } | { link: string }) {
	// 	if (this.media_type === 'none') {
	// 		return this;
	// 	}
	// 	this.header = {
	// 		type: this.media_type,
	// 		[this.media_type]: media,
	// 	} as any;
	// 	return this;
	// }

	setBody(text: string) {
		this.body = {
			type: 'body',
			text,
		};
		return this;
	}

	setFooter(text: string) {
		this.footer = {
			type: 'footer',
			text,
		};
		return this;
	}

	setFlowToken(token: string) {
		this.flow_token = token;
		return this;
	}

	toObject(): any {
		return {
			to: this.getRecipient(),
			type: 'interactive',
			interactive: {
				type: 'flow',
				...(this.header ? { header: this.header } : {}),
				...(this.body ? { body: this.body } : {}),
				...(this.footer ? { footer: this.footer } : {}),
				action: {
					name: 'flow',
					parameters: {
						flow_message_version: '3',
						flow_action: 'navigate',
						flow_token: this.flow_token ?? `wautopilot_${this.flow_id}_${generateText(2)}`,
						flow_id: this.flow_id,
						flow_cta: this.flow_cta,
						flow_action_payload: {
							screen: this.screen,
						},
					},
				},
			},
			context: this.context,
		};
	}
}
