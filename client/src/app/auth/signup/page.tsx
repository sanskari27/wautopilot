import AuthService from '@/services/auth.service';
import { redirect, RedirectType } from 'next/navigation';
import SignForm from './form';
import { Suspense } from 'react';
import Loading from '@/components/elements/loading';

export default async function Signup() {

	return (
		<Suspense fallback={<Loading />}>
			<SignForm />
		</Suspense>
	);
}
