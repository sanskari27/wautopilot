import { Suspense } from 'react';
import { ResetPassword } from './form';
import Loading from '@/components/elements/loading';

export default function ResetPasswordWrapper() {
	return (
		<Suspense fallback={<Loading />}>
			<ResetPassword />
		</Suspense>
	);
}
