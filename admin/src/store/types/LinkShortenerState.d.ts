export type LinkShortenerState = {
	details: {
		id: string;
		type: 'whatsapp' | 'link';
		title: string;
		link: string;
		number: string;
		message: string;
	};
	list: ShortLink[];
	ui: {
		loading_links: boolean;
		shortening_link: boolean;
		link_copied: boolean;
	};
};

export type ShortLink = {
	id: string;
	shorten_link: string;
	link: string;
	base64: string;
	title: string;
	isWhatsappLink: boolean;
	number: string;
	message: string;
};
