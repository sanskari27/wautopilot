import AuthService from '@/services/auth.service';
import { notFound, redirect } from 'next/navigation';
import { default as PaymentProvider } from './payment-provider';

export default async function AddMoney({
	searchParams,
}: {
	searchParams: {
		amount: string;
		redirect_url: string;
	};
}) {
	const amount = Number(searchParams.amount);
	if (isNaN(amount) || amount <= 0) {
		redirect('/');
	}

	const res = await AuthService.addMoney(amount);
	if (!res) {
		notFound();
	}

	return (
		<PaymentProvider
			razorpay_options={res.razorpay_options}
			transaction_id={res.transaction_id}
			redirect_url={searchParams.redirect_url}
		/>
	);
}
