import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import AuthService from '../services/auth.service';

const init = { isLoggedIn: false, isAuthChecking: false };

const useAuth = singletonHook(init, () => {
	const [isLoggedIn, setIsLoggedIn] = useState(init.isLoggedIn);
	const [isAuthChecking, setIsAuthChecking] = useState(init.isAuthChecking);

	useEffect(() => {
		const checkLoginStatus = async () => {
			setIsAuthChecking(true);
			const loggedIn = await AuthService.isAuthenticated();
			console.log('Logged in:', loggedIn);
			setIsLoggedIn(loggedIn);
			setIsAuthChecking(false);
		};

		checkLoginStatus();
	}, []);

	return { isLoggedIn, isAuthChecking };
});

export default useAuth;
