'use client';
import { parseToObject } from '@/lib/utils';
import { Recurring, recurringSchema } from '@/schema/broadcastSchema';
import RecurringService from '@/services/recurring.service';
import { notFound, useSearchParams } from 'next/navigation';
import DataForm from '../_components/data-form';

export default function EditRecurring({
	params: { recurring_id },
}: {
	params: { recurring_id: string };
}) {
	const searchParams = useSearchParams();
	const raw = parseToObject(searchParams.get('data'));
	const data = recurringSchema.safeParse(raw);

	function handleSave(data: Recurring) {
		RecurringService.editRecurring({
			...data,
			id: recurring_id,
		});
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
