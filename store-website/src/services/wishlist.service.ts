import api from '@/lib/api';

export async function isInWishlist(id: string) {
	try {
		const { data } = await api.get(`/wishlist/${id}`);
		return data.contains;
	} catch (err) {
		return false;
	}
}

export async function addToWishlist(id: string) {
	try {
		await api.post(`/wishlist/${id}`);
		return true;
	} catch (err) {
		return false;
	}
}

export async function removeFromWishlist(id: string) {
	try {
		await api.delete(`/wishlist/${id}`);
	} catch (err) {}
}
