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
import useManagedEmployees from '@/hooks/useManagedEmployees';
import { inviteSchema } from '@/schema/organization';
import OrganizationService from '@/services/organization.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import Combobox from '../ui/combobox';
import { Switch } from '../ui/switch';

export function InviteDialog() {
	const searchParams = useSearchParams();
	const modal = searchParams.get('invite');

	if (!modal) return null;

	return <InviteForm />;
}

export function InviteForm() {
	const pathname = usePathname();
	const org_id = pathname.split('/')[2];
	const employeeList = useManagedEmployees(org_id);
	const [isLoading, setLoading] = useState(false);

	const router = useRouter();
	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			email: '',
			parent_id: '',
			can_create_others: false,
			can_let_others_create: false,
		},
	});
	const parent_id = watch('parent_id');
	const can_create_others = watch('can_create_others');
	const can_let_others_create = watch('can_let_others_create');

	async function formSubmit(values: z.infer<typeof inviteSchema>) {
		setLoading(true);
		const success = await OrganizationService.inviteEmployee(org_id, values);
		setLoading(false);
		if (success) {
			toast.success('Invitation sent to the employee');
			router.replace(pathname);
		} else {
			setError('email', { message: 'Unable to invite' });
		}
	}

	const employees = employeeList.map((employee) => ({
		value: employee.id,
		label: employee.name,
	}));

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
					<DialogTitle>Invite People</DialogTitle>
					<DialogDescription>
						Invite people to your organization to collaborate on projects.
					</DialogDescription>
				</DialogHeader>
				<form method='post' onSubmit={handleSubmit(formSubmit)}>
					<div className='grid gap-4 py-4'>
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
						<div className='grid gap-2'>
							<Label htmlFor='email'>Reporting Person</Label>
							<Combobox
								placeholder='Select reporting person...'
								items={employees}
								value={parent_id}
								onChange={(value) => setValue('parent_id', value)}
							/>
						</div>
						<div className='flex items-center justify-between'>
							<Label htmlFor='create-others'>Can add other employees?</Label>
							<Switch
								id='create-others'
								checked={can_create_others}
								onCheckedChange={(val) => setValue('can_create_others', val)}
							/>
						</div>
						<div className='flex items-center justify-between'>
							<Label htmlFor='let-create-others'>Can let others add employees?</Label>
							<Switch
								id='let-create-others'
								checked={can_let_others_create}
								onCheckedChange={(val) => setValue('can_let_others_create', val)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type='submit' className=' mt-6 w-[96%] mx-[2%]' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Invite
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
