'use client';
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
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import OrganizationService from '@/services/organization.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Permissions({
	org_id,
	emp_id,
	children,
	defaultData,
}: {
	org_id: string;
	emp_id: string;
	children: React.ReactNode;
	defaultData: {
		can_create_others: boolean;
		can_let_others_create: boolean;
	};
}) {
	const router = useRouter();
	const [can_create_others, setCanCreateOthers] = useState(defaultData.can_create_others);
	const [can_let_others_create, setCanLetOthersCreate] = useState(
		defaultData.can_let_others_create
	);

	const handleSubmit = async () => {
		toast.promise(
			OrganizationService.updatePermissions({
				org_id,
				emp_id,
				can_create_others,
				can_let_others_create,
			}),
			{
				loading: 'Updating permissions...',
				success: () => {
					router.refresh();
					return 'Permissions updated successfully.';
				},
				error: 'You do not have permission for this action.',
			}
		);
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Update employee permissions</AlertDialogTitle>
					<AlertDialogDescription>
						Change the permissions for the employee in the organization
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<div className='grid gap-4 py-4'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='create-others'>Can add other employees?</Label>
							<Switch
								id='create-others'
								checked={can_create_others}
								onCheckedChange={setCanCreateOthers}
							/>
						</div>
						<div className='flex items-center justify-between'>
							<Label htmlFor='let-create-others'>Can let others add employees?</Label>
							<Switch
								id='let-create-others'
								checked={can_let_others_create}
								onCheckedChange={setCanLetOthersCreate}
							/>
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleSubmit}>Save</AlertDialogAction>
					</AlertDialogFooter>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
