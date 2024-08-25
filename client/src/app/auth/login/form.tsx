'use client';

import Link from 'next/link';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOGO_PRIMARY } from '@/lib/consts';
import { loginSchema } from '@/schema/auth';
import AuthService from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const {
		handleSubmit,
		register,
		setError,
		setValue,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function formSubmit(values: z.infer<typeof loginSchema>) {
		setLoading(true);
		const success = await AuthService.login(values.email, values.password);
		if (success.authenticated) {
			router.push('/panel/home/dashboard');
		} else {
			setLoading(false);
			setError('password', { message: 'Invalid Credentials' });
		}
	}

	return (
		<Centered>
			<Card className='mx-auto max-w-md w-[90%] md:w-full'>
				<CardHeader>
					<CardTitle className='text-3xl text-center inline-flex justify-center items-center gap-2'>
						<Image src={LOGO_PRIMARY} alt='Logo' width={48} height={48} />
						<span className='text-primary font-bold'>Wautopilot</span>
					</CardTitle>
					<CardDescription className='text-center  text-lg text-primary'>
						Login to continue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form method='post' onSubmit={handleSubmit(formSubmit)}>
						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='email' className='text-primary'>
									Email
								</Label>
								<Input
									type='email'
									placeholder='john@example.com'
									{...register('email', { required: true, pattern: /^\S+@\S+$/i })}
									onChange={(e) => {
										setValue('email', e.target.value);
										resetErrors();
									}}
									isInvalid={!!errors.password?.message}
								/>
							</div>
							<div className='grid gap-2'>
								<div className='flex items-center'>
									<Label htmlFor='password' className='text-primary'>
										Password
									</Label>
									<Link
										href='/auth/forgot-password'
										className='ml-auto inline-block text-sm underline'
									>
										Forgot your password?
									</Link>
								</div>
								<Input
									type='password'
									{...register('password', { required: true, minLength: 8 })}
									onChange={(e) => {
										setValue('password', e.target.value);
										resetErrors();
									}}
									isInvalid={!!errors.password?.message}
								/>
								<span className='text-red-500 text-sm text-center'>{errors.password?.message}</span>
							</div>
							<Button type='submit' className='w-full' disabled={loading}>
								{loading && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
								Login
							</Button>
						</div>
						<div className='mt-4 text-center text-sm'>
							Don&apos;t have an account?{' '}
							<Link href='/auth/signup' className='underline'>
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</Centered>
	);
}
