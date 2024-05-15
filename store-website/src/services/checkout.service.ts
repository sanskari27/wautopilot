import api from '@/lib/api';

export async function startCheckout() {
	try {
		const { data } = await api.post('/checkout/start-checkout');
		return data.transaction_id as string;
	} catch (err) {
		return null;
	}
}

export async function addCoupon(coupon: string) {
	try {
		await api.post(`/checkout/coupon`, {
			coupon,
		});
		return true;
	} catch (err) {
		return false;
	}
}

export async function removeCoupon() {
	try {
		await api.delete(`/checkout/coupon`);
		return true;
	} catch (err) {
		return false;
	}
}

export async function billingDetails(details: {
	email: string;
	phone: string;
	name: string;
	address_line_1: string;
	address_line_2?: string;
	address_line_3?: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
	payment_method: 'cod' | 'prepaid';
}) {
	try {
		await api.post(`/checkout/billing-details`, details);
		return true;
	} catch (err) {
		return false;
	}
}

export async function initiatePaymentProvider(id?: string) {
	try {
		let _data = null;
		if (id) {
			const { data } = await api.post(`/checkout/${id}/retry-payment`);
			_data = data;
		} else {
			const { data } = await api.post(`/checkout/initiate-payment-provider`);
			_data = data;
		}
		if (!_data) {
			throw new Error();
		}

		return {
			redirect: _data.redirect,
			link: _data.payment_link as string,
		};
	} catch (err) {
		return null;
	}
}

export async function requestReturn(id: string) {
	try {
		await api.post(`/orders/${id}/request-return`);
		return true;
	} catch (err) {
		return false;
	}
}

export async function cancelReturnRequest(id: string) {
	try {
		await api.delete(`/orders/${id}/request-return`);
		return true;
	} catch (err) {
		return false;
	}
}

export async function cancelOrder(id: string) {
	try {
		await api.post(`/orders/${id}/cancel`);
		return true;
	} catch (err) {
		return false;
	}
}
