'use client';
import Show from '@/components/containers/show';
import { useTemplates } from '@/components/context/templates';
import { AddTemplate } from './_components/buttons';
import { DataTable } from './_components/data-table';

export default function Templates() {
	const templates = useTemplates();
	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Templates</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Show.ShowIf condition>
						<AddTemplate />
					</Show.ShowIf>
				</div>
			</div>

			<DataTable records={templates} />
		</div>
	);
}
