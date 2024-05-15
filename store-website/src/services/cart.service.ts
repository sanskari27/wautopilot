import api from '@/lib/api';

export async function addToCart(id: string) {
	try {
		await api.post(`/cart/${id}`);
	} catch (err) {}
}

export async function removeFromCart(id: string) {
	try {
		await api.delete(`/cart/${id}`);
		return true;
	} catch (err) {
		return false;
	}
}
