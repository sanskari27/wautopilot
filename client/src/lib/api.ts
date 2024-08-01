import axios from 'axios';

const isServer = typeof window === 'undefined';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true, // This ensures cookies are sent with every request
});

// Request interceptor
api.interceptors.request.use(async (config) => {
	if (isServer) {
		// If it's a server-side request, we need to manually set the cookie header
		const { cookies } = await import('next/headers');
		const cookieStore = cookies();
		const cookiesString = cookieStore
			.getAll()
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join('; ');
		config.headers['Cookie'] = cookiesString;
	}
	return config;
});

export default api;
