'use client';
import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

type RazorpayOptions = {
	description: string;
	currency: string;
	amount: number;
	name: string;
	order_id: string;
	prefill: {
		name: string;
		email: string;
		contact: string;
	};
	key: string;
	theme: {
		color: string;
	};
};

export default function PaymentProvider({
	transaction_id,
	razorpay_options,
	redirect_url,
}: {
	transaction_id: string;
	razorpay_options: RazorpayOptions;
	redirect_url?: string;
}) {
	const router = useRouter();
	const dialogOpen = useRef(false);
	const toastId = useRef<string | null>(null);

	const handlePayment = useCallback(
		(razorpay_options: RazorpayOptions, transaction_id: string) => {
			try {
				const rzp1 = new (window as any).Razorpay({
					...razorpay_options,
					handler: async function () {
						toast.dismiss(toastId.current ?? '');
						toast.promise(AuthService.confirmPayment(transaction_id), {
							loading: 'Confirming payment...',
							success: () => {
								router.replace(redirect_url ?? '/');
								return 'Transaction successful';
							},
							error: 'Transaction failed',
						});
					},
					modal: {
						ondismiss: function () {
							toast.dismiss(toastId.current ?? '');
							router.replace(redirect_url ?? '/');
							toast.error('Transaction cancelled');
						},
					},
				});

				rzp1.open();
			} catch (err) {
				console.log(err);
			}
		},
		[redirect_url, router]
	);

	useEffect(() => {
		setTimeout(() => {
			if (dialogOpen.current) return;
			toastId.current = toast.loading('Loading payment gateway...');
			dialogOpen.current = true;
			handlePayment(razorpay_options, transaction_id);
		}, 1000);
	}, [razorpay_options, transaction_id, handlePayment]);

	return <></>;
}
