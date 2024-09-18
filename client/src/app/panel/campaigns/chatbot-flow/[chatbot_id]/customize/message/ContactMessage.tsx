'use client';
import ContactDialog from '@/components/elements/dialogs/contact';
import ContactSelectorDialog from '@/components/elements/dialogs/contact-selector';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useBoolean from '@/hooks/useBoolean';
import { parseToSeconds } from '@/lib/utils';
import { Contact } from '@/schema/phonebook';
import { useState } from 'react';

export type ContactMessageProps = {
	onContactAdded: (contact: Contact, delay: number) => void;
	children: React.ReactNode;
};

const ContactMessage = ({ onContactAdded, children }: ContactMessageProps) => {
	const {
		value: isContactDialogOpen,
		on: openContactDialog,
		off: closeContactDialog,
	} = useBoolean();

	const [contact, setContact] = useState<Contact | null>(null);
	const [delay, setDelay] = useState(0);
	const [delayType, setDelayType] = useState<'sec' | 'min' | 'hour'>('sec');

	const handleSave = () => {
		if (!contact) return;
		onContactAdded(contact, parseToSeconds(delay, delayType));
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Contact Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<ContactSelectorDialog onConfirm={(c) => setContact(c[0])} newEntryAllowed singleSelect>
						<Button variant={'secondary'}>
							{contact ? contact.name.formatted_name ?? 'No name' : 'Select Contact'}
						</Button>
					</ContactSelectorDialog>
				</div>
				<Separator />
				<DialogFooter>
					<div className='inline-flex items-center gap-2 mr-auto'>
						<p className='text-sm'>Send after</p>
						<Input
							className='w-20'
							placeholder={'Enter delay in seconds'}
							value={delay.toString()}
							onChange={(e) => setDelay(Number(e.target.value))}
						/>
						<Select
							value={delayType}
							onValueChange={(val: 'sec' | 'min' | 'hour') => setDelayType(val)}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select one' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value='sec'>Seconds</SelectItem>
									<SelectItem value='min'>Minutes</SelectItem>
									<SelectItem value='hour'>Hours</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<DialogClose asChild>
						<Button type='submit' disabled={!contact} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
			{isContactDialogOpen && (
				<ContactDialog
					defaultValues={contact}
					onSave={(data) => {
						setContact(data);
						closeContactDialog();
					}}
					onClose={closeContactDialog}
				/>
			)}
		</Dialog>
	);
};

ContactMessage.displayName = 'TextMessage';

export default ContactMessage;
