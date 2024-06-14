export type RecipientsState = {
	list: Recipient[];
	uiDetails: {
		loading: boolean;
	};
	selected_recipient_id: string;
	selected_recipient: Recipient;
};

export type Recipient = {
	_id: string;
	recipient: string;
	profile_name: string;
	origin: string;
	expiration_timestamp: string;
};
