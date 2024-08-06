'use client';
import { Recurring } from '@/schema/broadcastSchema';
import RecurringService from '@/services/recurring.service';
import { useParams, usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DataForm from '../_components/data-form';

export default function CreateRecurring() {
	const router = useRouter();
	const params = useParams();

	function handleSave(data: Recurring) {

		RecurringService.createRecurring(data)
			.then((res) => {
				if (!res) {
					return toast.error('Failed to create Recurring Broadcast');
				}
				router.refresh();
				router.push(`/${params.panel}/campaigns/recurring`);
				return toast.success('Recurring Broadcast created successfully');
			})
			.catch((err) => {
				return toast.error('Failed to create Recurring Broadcast');
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
