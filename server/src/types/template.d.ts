export type TextHeader = {
	type: 'HEADER';
	format: 'TEXT';
	text: string;
	example: {
		header_text: string[];
	};
};

export type ImageHeader = {
	type: 'HEADER';
	format: 'IMAGE';
	example: {
		header_handle: string[];
	};
};

export type DocumentHeader = {
	type: 'HEADER';
	format: 'DOCUMENT';
	example: {
		header_handle: string[];
	};
};

export type HeaderTemplate = TextHeader | ImageHeader | DocumentHeader;

export type BodyTemplate = {
	type: 'BODY';
	text: string;
	example: {
		body_text: [string[]];
	};
};

export type FooterTemplate = {
	type: 'FOOTER';
	text: string;
};

export type ButtonsType =
	| {
			type: 'URL';
			text: string;
			url: string;
	  }
	| {
			type: 'PHONE_NUMBER';
			text: string;
			phone_number: string;
	  }
	| {
			type: 'QUICK_REPLY';
			text: string;
	  };

export type ButtonsTemplate = {
	type: 'BUTTONS';
	buttons: ButtonsType[];
};

export type Template = {
	name: string;
	category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
	allow_category_change?: boolean;
	language: string;
	components: (HeaderTemplate | BodyTemplate | FooterTemplate | ButtonsTemplate)[];
};
