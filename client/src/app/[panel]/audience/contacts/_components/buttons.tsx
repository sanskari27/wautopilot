'use client';
import { usePermissions } from '@/components/context/user-details';
import ContactDialog from '@/components/elements/dialogs/contact';
import { Button } from '@/components/ui/button';
import { parseToObject } from '@/lib/utils';
import { contactSchema } from '@/schema/phonebook';
import ContactService from '@/services/contact.service';
import { ContactRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';

export function AddContact() {
	const permission = usePermissions().contacts.create;

	if (!permission) return null;

	return (
		<Link href={`?contact=new`}>
			<Button size={'sm'} className='bg-teal-600 hover:bg-teal-700'>
				<ContactRound className='w-4 h-4 mr-2' />
				Add Contact
			</Button>
		</Link>
	);
}

export function ShowContactDialog() {
	const permissions = usePermissions().contacts;
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const contact = searchParams.get('contact');

	const raw = parseToObject(searchParams.get('data'));
	const data = contactSchema.safeParse(raw);

	const handleContactInput = (contact: z.infer<typeof contactSchema>) => {
		let id = searchParams.get('contact');
		id = id === 'new' ? null : id;
		let promise;
		if (id) {
			if (!permissions.update) {
				toast.error('You do not have permission to update contact');
				return;
			}
			promise = ContactService.updateContact({ ...contact, id });
		} else {
			if (!permissions.create) {
				toast.error('You do not have permission to create contact');
				return;
			}
			promise = ContactService.addContact(contact);
		}

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

	if (!contact) return null;

	return (
		<ContactDialog onSave={handleContactInput} defaultValues={data.success ? data.data : null} />
	);
}
