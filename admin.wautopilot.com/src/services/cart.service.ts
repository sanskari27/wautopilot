import api from '@/lib/api';

export async function addToCart(id: string) {
	try {
		await api.post(`/cart/${id}`);
	} catch (err) {}
}
