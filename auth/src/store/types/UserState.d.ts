export type UserState = {
	uiDetails: UserUIDetails;
	email: string;
	newEmail: string;
	password: string;
	newPassword:string;
	name: string;
	phone: string;
	confirmPassword: string;
	accessLevel: UserLevel;
	error: {
		message: string;
		type: 'password' | 'email' | 'confirm password' | 'server' | 'name' | 'phone' | '';
	};
};

export enum UserLevel {
	Agent = 10,
	Admin = 20,
	WhiteLabel = 30,
	Master = 100,
}

export type UserUIDetails = {
	isLoading: boolean;
	isAuthenticated: boolean;
	isAuthenticating: boolean;
	resettingPassword: boolean;
};
