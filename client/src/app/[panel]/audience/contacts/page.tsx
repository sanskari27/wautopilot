'use client';
import Show from '@/components/containers/show';
import { useContacts } from '@/components/context/contact';
import ContactDialog from '@/components/elements/dialogs/contact';
import { contactSchema } from '@/schema/phonebook';
import ContactService from '@/services/contact.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { AddContact } from './_components/buttons';
import { DataTable } from './_components/data-table';

export default function Contacts() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const contacts = useContacts();

	const handleContactInput = (contact: z.infer<typeof contactSchema>) => {
		const id = searchParams.get('contact');
		const promise =
			id && id !== 'new'
				? ContactService.updateContact({ ...contact, id })
				: ContactService.addContact(contact);
		toast.promise(promise, {
			loading: 'Saving contact...',
			success: () => {
				router.replace(pathname);
				router.refresh();
				return 'Contact saved successfully';
			},
			error: 'Failed to save contact',
		});
	};

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
				<ContactDialog
					onSave={handleContactInput}
					defaultValues={searchParams.get('data') ? JSON.parse(searchParams.get('data')!) : null}
				/>
			</Show.ShowIf>
		</div>
	);
}
