import RazorpayAPI from '../../config/RazorpayAPI';

async function createCustomer(details: {
	name: string;
	email: string;
	phone_number: string;
	billing_address?: {
		street: string;
		city: string;
		district: string;
		state: string;
		country: string;
		pincode: string;
	};
}) {
	const notes = { ...details.billing_address };

	try {
		const customer = await RazorpayAPI.customers.create({
			name: details.name,
			contact: details.phone_number,
			email: details.email,
			notes: notes,
		});

		return {
			id: customer.id,
			name: customer.name,
			contact: customer.contact,
			email: customer.email,
			billing_address: {
				street: customer.notes?.street ?? '',
				city: customer.notes?.city ?? '',
				district: customer.notes?.district ?? '',
				state: customer.notes?.state ?? '',
				country: customer.notes?.country ?? '',
				pincode: customer.notes?.pincode ?? '',
			},
		};
	} catch (err: any) {
		if (err.statusCode === 400) {
			return fetchCustomerByContact(details.phone_number);
		}

		return null;
	}
}

async function fetchCustomerByContact(number: string) {
	const customers = await RazorpayAPI.customers.all();

	const customer = customers.items.find((customer) =>
		customer.contact?.toString().includes(number)
	);
	if (!customer) {
		return null;
	}

	return {
		id: customer.id,
		name: customer.name,
		contact: customer.contact,
		email: customer.email,
		billing_address: {
			street: customer.notes?.street as string | undefined | null,
			city: customer.notes?.city as string | undefined | null,
			district: customer.notes?.district as string | undefined | null,
			state: customer.notes?.state as string | undefined | null,
			country: customer.notes?.country as string | undefined | null,
			pincode: customer.notes?.pincode as string | undefined | null,
		},
	};
}

async function fetchCustomer(id: string) {
	const customer = await RazorpayAPI.customers.fetch(id);

	return {
		id: customer.id,
		name: customer.name,
		contact: customer.contact,
		email: customer.email,
		billing_address: {
			street: customer.notes?.street as string | undefined | null,
			city: customer.notes?.city as string | undefined | null,
			district: customer.notes?.district as string | undefined | null,
			state: customer.notes?.state as string | undefined | null,
			country: customer.notes?.country as string | undefined | null,
			pincode: customer.notes?.pincode as string | undefined | null,
		},
	};
}

async function fetchToken(customer_id: string) {
	const tokens = await RazorpayAPI.customers.fetchTokens(customer_id);
	if (tokens.items.length === 0) return null;
	const token = tokens.items[0];

	return {
		id: token.id,
		customer_id: token.customer_id,
		token: token.token,
	};
}

export default {
	createCustomer,
	fetchCustomer,
	fetchCustomerByContact,
	fetchToken,
};
