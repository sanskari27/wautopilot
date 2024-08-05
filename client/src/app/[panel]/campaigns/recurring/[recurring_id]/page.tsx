'use client';
import { parseToObject } from '@/lib/utils';
import { Recurring, recurringSchema } from '@/schema/broadcastSchema';
import { notFound, useSearchParams } from 'next/navigation';
import DataForm from '../_components/data-form';
import RecurringService from '@/services/recurring.service';

export default function EditRecurring() {
	const searchParams = useSearchParams();
	const raw = parseToObject(searchParams.get('data'));
	const data = recurringSchema.safeParse(raw);

	function handleSave(data: Recurring) {
		const isEditingRecurring = !!raw.id;
		const promise = isEditingRecurring
			? RecurringService.editRecurring({ deviceId: selected_device_id, details })
			: RecurringService.createRecurring({ deviceId: selected_device_id, details });
	}

	

	if (!data.success) {
		console.log(data.error.errors);

		notFound();
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Recurring Broadcast</h2>
			</div>
			<DataForm onSubmit={handleSave} defaultValues={data.success ? data.data : undefined} />
		</div>
	);
}
