'use client';
import { parseToObject } from '@/lib/utils';
import { Recurring, recurringSchema } from '@/schema/broadcastSchema';
import RecurringService from '@/services/recurring.service';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DataForm from '../_components/data-form';

export default function EditRecurring({
	params: { recurring_id },
}: {
	params: { recurring_id: string };
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const raw = parseToObject(searchParams.get('data'));
	const data = recurringSchema.safeParse(raw);

	function handleSave(data: Recurring) {
		toast.promise(RecurringService.editRecurring({ ...data, id: recurring_id }), {
			loading: 'Updating Recurring Campaign',
			success: () => {
				router.back();
				return 'Recurring Campaign updated successfully';
			},
			error: 'Failed to update Recurring Campaign',
		});
	}

	if (!data.success) {
		notFound();
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Recurring Campaign</h2>
			</div>
			<DataForm onSubmit={handleSave} defaultValues={data.success ? data.data : undefined} />
		</div>
	);
}
