import axios from 'axios';
import APIInstance from '../config/APIInstance';
import { SERVER_URL } from '../config/const';

export default class AuthService {
	static async isAuthenticated() {
		try {
			await axios.get(SERVER_URL + 'sessions/validate-auth/admin', {
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

	static async login(email: string, password: string, latitude: number, longitude: number) {
		try {
			await APIInstance.post(`/sessions/login`, {
				email,
				password,
				accessLevel: 'client',
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

	static async registerUser(
		email: string,
		password: string,
		accessLevel: string,
		latitude: number,
		longitude: number
	) {
		try {
			const data = await APIInstance.post(`/sessions/register`, {
				email,
				password,
				accessLevel,
				latitude,
				longitude,
			});
			return data;
		} catch (err) {
			//ignore
		}
	}

	static async forgotPassword(email: string, callbackURL: string) {
		try {
			await APIInstance.post(`/sessions/reset-password`, {
				email,
				callbackURL,
			});
			return true;
		} catch (err) {
			return false;
		}
	}
}
