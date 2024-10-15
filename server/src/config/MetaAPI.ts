import axios from 'axios';

export default function MetaAPI(authToken?: string, version: string = 'v20.0') {
	return axios.create({
		baseURL: `https://graph.facebook.com/${version}/`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${authToken}`,
		},
	});
}
