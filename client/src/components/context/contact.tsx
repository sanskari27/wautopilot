'use client';

import { Contact, ContactWithID } from '@/schema/phonebook';
import * as React from 'react';

const ContactsContext = React.createContext<ContactWithID[]>([]);

export function ContactsProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: ContactWithID[];
}) {
	return <ContactsContext.Provider value={data}>{children}</ContactsContext.Provider>;
}

export const useContacts = () => React.useContext(ContactsContext);
