import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import AuthService from '../services/auth.service';

const initStatus = { isAuthenticated: false };

let globalSet: React.Dispatch<
	React.SetStateAction<{
		isAuthenticated: boolean;
	}>
> = () => {
	throw new Error('you must useAuth before setting its state');
};

const useAuth = singletonHook(initStatus, () => {
	const [auth, setAuth] = useState(initStatus);
	globalSet = setAuth;
	useEffect(() => {
		const checkAuthStatus = async () => {
			const isLoggedIn = await AuthService.isAuthenticated();
			setAuth({ isAuthenticated: isLoggedIn });
		};
		checkAuthStatus();
	}, []);

	return auth;
});

export const setAuthenticated = (status: boolean) => {
	globalSet({ isAuthenticated: status });
};

export default useAuth;
