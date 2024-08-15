import Loading from '@/components/elements/loading';
import { TRANSFER_MONEY } from '@/lib/consts';
import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Add Money • Wautopilot',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense fallback={<Loading />}>
			<Script id='razorpay-checkout-js' src='https://checkout.razorpay.com/v1/checkout.js' />
			{children}
			<div className='absolute top-0 right-0 left-0 bottom-0 w-full flex justify-center items-center p-4'>
				<Image
					src={TRANSFER_MONEY}
					alt='Razorpay'
					width={400}
					height={200}
					className='w-3/5 md:w-2/5 lg:w-1/5'
				/>
			</div>
		</Suspense>
	);
}
