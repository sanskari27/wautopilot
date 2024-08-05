'use client';

import { Contact } from '@/schema/phonebook';
import * as React from 'react';

const ContactsContext = React.createContext<Contact[]>([]);

export function ContactsProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: Contact[];
}) {
	return <ContactsContext.Provider value={data}>{children}</ContactsContext.Provider>;
}

export const useContacts = () => React.useContext(ContactsContext);
