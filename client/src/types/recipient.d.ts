export type Recipient = {
	_id: string;
	recipient: string;
	profile_name: string;
	origin: string;
	labels: string[];
	expiry?: number | 'EXPIRED';
};
