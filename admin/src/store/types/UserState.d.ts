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
};
