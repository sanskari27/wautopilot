import Each from '@/components/containers/each';
import { useContacts } from '@/components/context/contact';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import useBoolean from '@/hooks/useBoolean';
import { Contact, ContactWithID } from '@/schema/phonebook';
import React from 'react';
import ContactDialog from './contact';

export default function ContactSelectorDialog({
	children,
	singleSelect = false,
	onConfirm,
}: {
	children: React.ReactNode;
	singleSelect?: boolean;
	onConfirm: (contact: Contact[]) => void;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const { value: drawerVisible, on: openDrawer, off: closeDrawer } = useBoolean(false);

	const list = useContacts();

	const [selected, setSelected] = React.useState<string[]>([]);

	const handleAddMedia = (contact: ContactWithID) => {
		const id = contact.id;
		if (singleSelect) {
			setSelected([id]);
		} else {
			setSelected([...selected, id]);
		}
	};

	const handleRemoveMedia = (contact: ContactWithID) => {
		setSelected(selected.filter((id) => id !== contact.id));
	};

	const isSelected = (contact: ContactWithID) => selected.includes(contact.id);

	const handleSave = () => {
		const selectedContacts = list.filter((contact) => selected.includes(contact.id));
		onConfirm(selectedContacts);
		buttonRef.current?.click();
		setSelected([]);
		closeDrawer();
	};

	const handleNewContact = (contact: Contact) => {
		onConfirm([contact]);
		closeDrawer();
		buttonRef.current?.click();
		setSelected([]);
	};

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-xl lg:max-w-3xl'>
				<DialogHeader>
					<DialogTitle className='flex justify-between'>Select Media</DialogTitle>
				</DialogHeader>
				<ScrollArea className='gap-4 h-[400px]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell>S.No.</TableCell>
								<TableCell>File Name</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Each
								items={list}
								render={(contact) => (
									<TableRow>
										<TableCell>
											<Checkbox
												checked={isSelected(contact)}
												onCheckedChange={(checked) => {
													if (checked) {
														handleAddMedia(contact);
													} else {
														handleRemoveMedia(contact);
													}
												}}
											/>
										</TableCell>
										<TableCell>{contact.formatted_name}</TableCell>
									</TableRow>
								)}
							/>
						</TableBody>
					</Table>
				</ScrollArea>
				<DialogFooter>
					<Button variant={'outline'} onClick={openDrawer}>
						New Entry
					</Button>
					<Button
						type='submit'
						className='bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={handleSave}
					>
						Select
					</Button>
				</DialogFooter>
			</DialogContent>
			{drawerVisible && <ContactDialog onSave={handleNewContact} onClose={closeDrawer} />}
		</Dialog>
	);
}
