import Loading from '@/components/elements/loading';
import { Suspense } from 'react';
import LoginForm from './form';

export default async function Login() {
	return (
		<Suspense fallback={<Loading />}>
			<LoginForm />
		</Suspense>
	);
}
