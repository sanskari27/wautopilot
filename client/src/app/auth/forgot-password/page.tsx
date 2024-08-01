import Loading from '@/components/elements/loading';
import { Suspense } from 'react';
import ForgotPasswordForm from './form';

export default async function ForgotPassword() {
	return (
		<Suspense fallback={<Loading />}>
			<ForgotPasswordForm />
		</Suspense>
	);
}
