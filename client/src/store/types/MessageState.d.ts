export type MessageState = {
	messageList: Message[];
	uiDetails: {
		messagesLoading: boolean;
		errorMessage: string;
		attachmentUploading: boolean;
		isMessageSending: boolean;
	};
	message: {
		textMessage: string;
		attachment: {
			file: File | null;
			name: string;
			size: string;
			id: string;
			type: string;
			url: string;
		};
		attachment_id: string[];
		contactCard: {
			addresses: {
				type: string;
				street: string;
				city: string;
				state: string;
				zip: string;
				country: string;
				country_code: string;
			}[];
			birthday: string;
			emails: {
				email: string;
				type: string;
			}[];
			name: {
				formatted_name: string;
				first_name: string;
				last_name: string;
				middle_name: string;
				suffix: string;
				prefix: string;
			};
			org: {
				company: string;
				department: string;
				title: string;
			};
			phones: {
				phone: string;
				wa_id: string;
				type: string;
			}[];
			urls: {
				url: string;
				type: string;
			}[];
		}[];
	};
};

export type Message = {
	_id: string;
	status: string;
	recipient: string;

	received_at: string;

	delivered_at: string;
	read_at: string;
	sent_at: string;
	seen_at: string;

	message_id: string;

	failed_at: string;
	failed_reason: string;

	// header_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
	// header_content_source: 'LINK' | 'MEDIA_ID' | 'TEXT';
	// header_content: string;
	body: {
		body_type: 'TEXT' | 'MEDIA' | 'CONTACT' | 'LOCATION' | 'UNKNOWN';
		text: string;
		media_id: string;
		caption: string;
		contacts: {
			addresses: {
				type: string;
				street: string;
				city: string;
				state: string;
				zip: string;
				country: string;
				country_code: string;
			}[];
			birthday: string;
			emails: {
				email: string;
				type: string;
			}[];
			name: {
				formatted_name: string;
				first_name: string;
				last_name: string;
				middle_name: string;
				suffix: string;
				prefix: string;
			};
			org: {
				company: string;
				department: string;
				title: string;
			};
			phones: {
				phone: string;
				wa_id: string;
				type: string;
			}[];
			urls: {
				url: string;
				type: string;
			}[];
		}[];
		location: {
			latitude: string;
			longitude: string;
			name: string;
			address: string;
		};
	};
	footer_content: string;
	buttons: {
		button_type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY' | 'VOICE_CALL';
		button_content: string;
	}[];
	context: {
		from: string;
		id: string;
	};
};
