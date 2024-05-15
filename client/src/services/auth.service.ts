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

	static async login(email: string, password: string) {
		try {
			await APIInstance.post(`/sessions/login`, {
				email,
				password,
				type: 'admin',
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
}
