import axios from 'axios';

export default function MetaAPI(authToken?: string) {
	return axios.create({
		baseURL: `https://graph.facebook.com/v20.0/`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${authToken}`,
		},
	});
}
