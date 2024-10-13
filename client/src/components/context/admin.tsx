'use client';

import { Admin } from '@/types/admin';
import * as React from 'react';

const AdminContent = React.createContext<{
	list: Admin[];
	search: string;
	setSearchText: (text: string) => void;
}>({
	list: [],
	search: '',
	setSearchText: (text) => {},
});

export function AdminProvider({ children, data }: { children: React.ReactNode; data: Admin[] }) {
	const [search, setSearch] = React.useState('');
	const [admins, setAdmins] = React.useState<Admin[]>(data);

	const list = admins.filter(
		(admin) =>
			admin.name.toLowerCase().includes(search.toLowerCase()) ||
			admin.email.toLowerCase().includes(search.toLowerCase()) ||
			admin.phone.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<AdminContent.Provider
			value={{
				list: list,
				search: '',
				setSearchText: (text) => {
					setSearch(text);
				},
			}}
		>
			{children}
		</AdminContent.Provider>
	);
}

export const useAdmins = () => React.useContext(AdminContent).list;

export const useAdminSearch = () => React.useContext(AdminContent).setSearchText;
