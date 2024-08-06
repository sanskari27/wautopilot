'use client';
import { Recurring } from '@/schema/broadcastSchema';
import RecurringService from '@/services/recurring.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DataForm from '../_components/data-form';

export default function CreateRecurring() {
	const router = useRouter();

	function handleSave(data: Recurring) {
		toast.promise(RecurringService.createRecurring(data), {
			loading: 'Creating Recurring Broadcast',
			success: () => {
				router.back();
				return 'Recurring Broadcast created successfully';
			},
			error: 'Failed to create Recurring Broadcast',
		});
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Recurring Broadcast</h2>
			</div>
			<DataForm onSubmit={handleSave} />
		</div>
	);
}
