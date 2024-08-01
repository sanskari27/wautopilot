'use client';
import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetSchema } from '@/schema/auth';
import AuthService from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

export function ResetPassword() {
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
		resolver: zodResolver(resetSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function formSubmit(values: z.infer<typeof resetSchema>) {
		const code = searchParams.get('code');
		if (!code) {
			return toast.error('Invalid reset request');
		} else if (values.password !== values.confirmPassword) {
			return setError('password', { message: 'Passwords do not match' });
		}
		setLoading(true);
		const success = await AuthService.resetPassword(code, values.password);
		setLoading(false);
		if (success) {
			router.push('/organizations');
		} else {
			setError('password', { message: 'Invalid password reset token.' });
		}
	}

	useEffect(() => {
		if (!searchParams.get('code')) {
			router.push('/auth/login');
		}
	}, [searchParams, router]);

	return (
		<Centered>
			<Card className='mx-auto max-w-md w-[90%] md:w-full'>
				<CardHeader>
					<CardTitle className='text-2xl text-center'>Reset Password</CardTitle>
					<CardDescription className='text-center'>Enter your new credentials</CardDescription>
				</CardHeader>
				<CardContent>
					<form method='post' onSubmit={handleSubmit(formSubmit)}>
						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='password'>New Password</Label>
								<Input
									autoComplete='new-password'
									type='password'
									{...register('password', { required: true, minLength: 8 })}
									onChange={(e) => {
										setValue('password', e.target.value);
										resetErrors();
									}}
									isInvalid={!!errors.password?.message}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='password'>Confirm Password</Label>
								<Input
									autoComplete='new-password'
									type='password'
									{...register('confirmPassword', { required: true, minLength: 8 })}
									onChange={(e) => {
										setValue('confirmPassword', e.target.value);
										resetErrors();
									}}
									isInvalid={!!errors.password?.message}
								/>
								<span className='text-red-500 text-sm text-center'>{errors.password?.message}</span>
							</div>
							<Button type='submit' className='w-full' disabled={loading}>
								{loading && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
								Reset Password
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</Centered>
	);
}
