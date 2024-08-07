import axios from 'axios';
import { recheckNetwork } from '../hooks/useNetwork';
import AuthService from '../services/auth.service';
import { AUTH_URL, SERVER_URL } from './const';

const APIInstance = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	withCredentials: true,
});

APIInstance.interceptors.response.use(
	async (response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.code === 'ERR_NETWORK') {
			if (await recheckNetwork()) {
				originalRequest._retry = true;
				return APIInstance(originalRequest);
			} else {
				return Promise.reject(error);
			}
		}

		if (error.response?.data?.title === 'PERMISSION_DENIED') {
			await AuthService.logout();
			window.location.replace(`${AUTH_URL}auth/master/login?callback_url=${window.location.href}`);
		}

		if (error.response?.data?.title === 'SESSION_INVALIDATED' && !originalRequest._retry) {
			originalRequest._retry = true;
			const isAuthenticated = await AuthService.isAuthenticated();
			if (isAuthenticated) {
				return APIInstance(originalRequest);
			} else {
				window.location.replace(
					`${AUTH_URL}auth/master/login?callback_url=${window.location.href}`
				);
			}
		}

		return Promise.reject(error);
	}
);

export default APIInstance;
