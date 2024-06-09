import axios from 'axios';
import APIInstance from '../config/APIInstance';
import { SERVER_URL } from '../config/const';
import { UserLevel } from '../store/types/UserState';

export default class AuthService {
	static async isAuthenticated() {
		try {
			await axios.get(SERVER_URL + 'sessions/validate-auth', {
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					Expires: '0',
				},
				withCredentials: true,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async login(
		email: string,
		password: string,
		accessLevel: UserLevel,
		latitude: number,
		longitude: number
	) {
		try {
			await APIInstance.post(`/sessions/login`, {
				email,
				password,
				accessLevel,
				latitude,
				longitude,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async logout() {
		try {
			await APIInstance.post(`/sessions/login`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async registerUser(name: string, phone: string, email: string, accessLevel: UserLevel) {
		try {
			const data = await APIInstance.post(`/sessions/register`, {
				name,
				phone,
				email,
				accessLevel,
			});
			return data;
		} catch (err) {
			//ignore
		}
	}

	static async forgotPassword(email: string, callbackURL: string) {
		try {
			await APIInstance.post(`/sessions/forgot-password`, {
				email,
				callbackURL,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async resetPassword(password: string, code: string) {
		try {
			const { data } = await APIInstance.post(`/sessions/reset-password/${code}`, {
				password,
			});
			console.log(data);
			return true;
		} catch (err) {
			return false;
		}
	}
}
