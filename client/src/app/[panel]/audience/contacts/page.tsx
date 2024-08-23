import ContactService from '@/services/contact.service';
import { AddContact, ShowContactDialog } from './_components/buttons';
import { DataTable } from './_components/data-table';

export default async function Contacts() {
	const contacts = await ContactService.listContacts();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>VCards</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<AddContact />
				</div>
			</div>

			<DataTable records={contacts} />
			<ShowContactDialog />
		</div>
	);
}
