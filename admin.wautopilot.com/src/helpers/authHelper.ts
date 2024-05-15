import api from '@/lib/api';
import { cookies } from 'next/headers';

export async function isLoggedIn() {
	try {
		await api.get('/sessions/validate-auth', {
			headers: {
				Cookie: cookies().toString(),
			},
		});
		return true;
	} catch (err) {
		return false;
	}
}
