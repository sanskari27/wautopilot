'use client';

import { Permissions } from '@/types/permissions';
import * as React from 'react';

export type UserDetailsType = {
	name: string;
	email: string;
	phone: string;
	isSubscribed: boolean;
	subscription_expiry: string;
	walletBalance: number;
	no_of_devices: number;
	permissions: Permissions;
	isMaster: boolean;
	isAdmin: boolean;
	isAgent: boolean;
};

const UserDetailsContext = React.createContext<UserDetailsType>({
	name: '',
	email: '',
	phone: '',
	isSubscribed: false,
	subscription_expiry: '',
	walletBalance: 0,
	no_of_devices: 0,
	permissions: {
		auto_assign_chats: true,
		assigned_labels: [] as string[],
		phonebook: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		chatbot: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		chatbot_flow: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		broadcast: {
			create: false,
			update: false,
			report: false,
			export: false,
		},
		recurring: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		media: {
			create: false,
			update: false,
			delete: false,
		},
		contacts: {
			create: false,
			update: false,
			delete: false,
		},
		template: {
			create: false,
			update: false,
			delete: false,
		},
		buttons: {
			read: false,
			export: false,
		},
	},
	isMaster: false,
	isAdmin: false,
	isAgent: false,
});

export function UserDetailsProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: UserDetailsType;
}) {
	return <UserDetailsContext.Provider value={data}>{children}</UserDetailsContext.Provider>;
}

export const useUserDetails = () => React.useContext(UserDetailsContext);
