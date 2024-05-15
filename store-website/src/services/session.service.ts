import api from '@/lib/api';

export async function createSession() {
	try {
		await api.post('/sessions/create-session');
	} catch (err) {}
}

export async function isLoggedIn() {
	try {
		await api.get('/sessions/validate-auth');
		return true;
	} catch (err) {
		return false;
	}
}

export async function googleLogin(code: string) {
	try {
		await api.post('/sessions/google-login', {
			token: code,
		});
		return true;
	} catch (err) {
		return false;
	}
}

export async function logOut() {
	try {
		await api.post('/sessions/logout');
	} catch (err) {}
}

export async function emailLogin(email: string, password: string) {
	try {
		await api.post('/sessions/login', {
			email,
			password,
		});
		return true;
	} catch (err) {
		return false;
	}
}

export async function resetPassword(email: string) {
	try {
		await api.post('/sessions/reset-password', {
			email,
		});
		return true;
	} catch (err) {
		return false;
	}
}

export async function updatePassword(token: string, password: string) {
	try {
		await api.post('/sessions/update-password', {
			token,
			password,
		});
		return true;
	} catch (err) {
		return false;
	}
}

export async function registerEmail(email: string, password: string) {
	try {
		await api.post('/sessions/register', {
			email,
			password,
		});
		return true;
	} catch (err) {
		return false;
	}
}

export async function sendFeedback(text: string) {
	try {
		await api.post('/feedback', {
			data: text,
		});
		return true;
	} catch (err) {
		return false;
	}
}
