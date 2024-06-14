import { Box, Button } from '@chakra-ui/react';

const SamplePage = () => {
	const handlePayment = () => {
		const rzp1 = new (window as any).Razorpay({
			// ...result.razorpay_options,
			handler: function (response: any) {
				const order_id = response.razorpay_order_id;
				const payment_id = response.razorpay_payment_id;
				PaymentService.verifyPayment(bucket_id, order_id, payment_id).then(() => {
					openPaymentComplete();
				});
			},
			modal: {
				ondismiss: function () {
					setLoading(false);
				},
			},
		});

		rzp1.open();
	};
	return (
		<Box>
			<Button onClick={handlePayment}>Payment</Button>
		</Box>
	);
};

export default SamplePage;
