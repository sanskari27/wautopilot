export type RecipientsState = {
	list: Recipient[];
	pinnedConversations: Recipient[];
	unpinnedConversations: Recipient[];

	uiDetails: {
		loading: boolean;
	};
	selected_recipient: Recipient;
	label_filter: string[];
	unReadConversations: string[];
};

export type Recipient = {
	_id: string;
	recipient: string;
	profile_name: string;
	origin: string;
	labels: string[];
	expiry?: number | 'EXPIRED';
};
