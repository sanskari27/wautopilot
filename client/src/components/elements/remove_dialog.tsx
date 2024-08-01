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
import { Label } from '@/components/ui/label';
import useManagedEmployees from '@/hooks/useManagedEmployees';
import OrganizationService from '@/services/organization.service';
import {} from '@radix-ui/react-alert-dialog';
import { DeleteIcon, Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog';
import Combobox from '../ui/combobox';

export function RemoveDialog() {
	const searchParams = useSearchParams();
	const modal = searchParams.get('remove');

	if (!modal) return null;

	return <RemoveForm />;
}

export function RemoveForm() {
	const pathname = usePathname();
	const org_id = pathname.split('/')[2];
	const employeeList = useManagedEmployees(org_id);
	const [isLoading, setLoading] = useState(false);
	const [id, setValue] = useState('');

	const router = useRouter();

	async function formSubmit() {
		setLoading(true);
		const success = await OrganizationService.removeEmployee(org_id, id);
		setLoading(false);
		if (success) {
			toast.success('Member removed successfully.');
			router.replace(pathname);
		} else {
			toast.error('Permission denied.');
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
					<DialogTitle>Remove People</DialogTitle>
					<DialogDescription>
						Select a member to remove from the organization. This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Select member to remove</Label>
						<Combobox
							placeholder='Select member...'
							items={employees}
							value={id}
							onChange={(value) => setValue(value)}
						/>
					</div>
				</div>

				<DialogFooter>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button className='w-full' variant='destructive' disabled={isLoading || !id}>
								{isLoading ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : (
									<DeleteIcon className='mr-2 h-4 w-4 ' />
								)}
								Remove
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently remove the member from the
									organization.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
									onClick={formSubmit}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
