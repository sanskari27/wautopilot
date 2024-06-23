export type AdminState = {
	admins: Admin[];
	loading: boolean;
	error: string;
};

export type Admin = {
    id: string;
	name: string;
	email: string;
	isSubscribed: boolean;
	phone: string;
	subscription_expiry: string;
	markup: number;
};
