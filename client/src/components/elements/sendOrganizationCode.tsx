'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { organizationCodeSchema } from '@/schema/organization';
import AdminService from '@/services/admin.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export function SendOrganizationCode() {
	const searchParams = useSearchParams();
	const modal = searchParams.get('organization-coupon-code');

	if (!modal) return null;

	return <SendOrganizationCodeForm />;
}

export function SendOrganizationCodeForm() {
	const pathname = usePathname();
	const [isLoading, setLoading] = useState(false);

	const router = useRouter();
	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(organizationCodeSchema),
		defaultValues: {
			name: '',
			email: '',
		},
	});

	async function formSubmit(values: z.infer<typeof organizationCodeSchema>) {
		setLoading(true);
		const success = await AdminService.sendOrganizationInviteCode(values);
		setLoading(false);
		if (success) {
			toast.success('Coupon code sent successfully');
			router.replace(pathname);
		} else {
			setError('email', { message: 'Unable to share the coupon code' });
		}
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathname);
				}
			}}
		>
			<DialogContent className='max-w-sm md:max-w-lg'>
				<DialogHeader>
					<DialogTitle>Coupon Code</DialogTitle>
					<DialogDescription>
						Share the coupon code that can be used to create an organization
					</DialogDescription>
				</DialogHeader>
				<form method='post' onSubmit={handleSubmit(formSubmit)}>
					<div className='grid gap-2 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>Name</Label>
							<Input
								type='text'
								placeholder='John Doe'
								{...register('name', { required: true })}
								onChange={() => resetErrors()}
								isInvalid={!!errors.name?.message}
							/>
							<span className='text-red-500 text-sm text-center'>{errors.name?.message}</span>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								type='email'
								placeholder='john@example.com'
								{...register('email', { required: true, pattern: /^\S+@\S+$/i })}
								onChange={() => resetErrors()}
								isInvalid={!!errors.email?.message}
							/>
							<span className='text-red-500 text-sm text-center'>{errors.email?.message}</span>
						</div>
					</div>

					<DialogFooter>
						<Button type='submit' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Send Coupon
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
