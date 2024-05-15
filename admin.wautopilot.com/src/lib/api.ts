import axios from 'axios';
import { SERVER_URL } from './const';

const api = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	withCredentials: true,
});

export default api;
