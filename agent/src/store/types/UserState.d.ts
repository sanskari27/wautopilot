export type UserState = {
	isAuthenticated: boolean;
	uiDetails: UserUIDetails;
	email: string;
	password: string;
	name: string;
	phone: string;
	confirmPassword: string;
	accessLevel: UserLevel;
	error: {
		message: string;
		type: 'password' | 'email' | 'confirm password' | 'server' | 'name' | 'phone' | '';
	};
	selected_device_id: string;
	user_details: UserDetails;
	all_labels: string[];
};

export enum UserLevel {
	Agent = 10,
	Admin = 20,
	WhiteLabel = 30,
	Master = 100,
}

export type UserUIDetails = {
	isAuthenticated: boolean;
	isAuthenticating: boolean;
	resettingPassword: boolean;
};

export type UserDetails = {
	name: string;
	email: string;
	phone: string;
	isSubscribed: boolean;
	subscription_expiry: string;
	walletBalance: number;
	no_of_devices: number;

	permissions: {
		view_broadcast_reports: false;
		create_broadcast: false;
		create_recurring_broadcast: false;
		create_phonebook: false;
		update_phonebook: false;
		delete_phonebook: false;
		auto_assign_chats: false;
		create_template: false;
		update_template: false;
		delete_template: false;
		manage_media: false;
		manage_contacts: false;
		manage_chatbot: false;
		manage_chatbot_flows: false;
	};
};
