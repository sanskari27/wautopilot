import axios from 'axios';

const MetaAPI = axios.create({
	baseURL: `https://graph.facebook.com/v20.0/`,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

export default MetaAPI;
