export type UserState = {
	isAuthenticated: boolean;
    isAuthenticating:boolean;
	email: string;
	password: string;
	confirmPassword: string;
	error: {
		message: string;
		type: 'password' | 'email' | 'confirm password' | 'server' | '';
	};
};
