'use client';
import Show from '@/components/containers/show';
import { useContacts } from '@/components/context/contact';
import ContactDialog from '@/components/elements/dialogs/contact';
import { useSearchParams } from 'next/navigation';
import { AddContact } from './(components)/buttons';
import { DataTable } from './(components)/data-table';

export default function Contacts() {
	const searchParams = useSearchParams();
	const contacts = useContacts();
	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Contacts</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Show.ShowIf condition>
						<AddContact />
					</Show.ShowIf>
				</div>
			</div>

			<DataTable records={contacts} />
			<Show.ShowIf condition={!!searchParams.get('contact')}>
				<ContactDialog />
			</Show.ShowIf>
		</div>
	);
}
