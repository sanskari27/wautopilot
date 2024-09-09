'use client';
import ContactDialog from '@/components/elements/dialogs/contact';
import useBoolean from '@/hooks/useBoolean';
import { Contact } from '@/schema/phonebook';

export type ContactMessageProps = {
	onContactAdded: (contact: Contact) => void;
	children: React.ReactNode;
};

const ContactMessage = ({ onContactAdded, children }: ContactMessageProps) => {
	const {
		value: isContactDialogOpen,
		on: openContactDialog,
		off: closeContactDialog,
	} = useBoolean();

	return (
		<>
			<div onClick={openContactDialog}>{children}</div>
			{isContactDialogOpen && (
				<ContactDialog
					onSave={(data) => {
						onContactAdded(data);
						closeContactDialog();
					}}
				/>
			)}
		</>
	);
};

ContactMessage.displayName = 'TextMessage';

export default ContactMessage;
