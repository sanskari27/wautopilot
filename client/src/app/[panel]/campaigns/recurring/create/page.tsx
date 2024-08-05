'use client';
import { Recurring } from '@/schema/broadcastSchema';
import DataForm from '../_components/data-form';

export default function CreateRecurring() {
	function handleSave(data: Recurring) {}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Recurring Broadcast</h2>
			</div>
			<DataForm onSubmit={handleSave} />
		</div>
	);
}
