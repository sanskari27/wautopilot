'use client';

import { Permissions } from '@/schema/access';
import * as React from 'react';

export type UserDetailsType = {
	name: string;
	email: string;
	phone: string;
	isSubscribed: boolean;
	subscription_expiry: string;
	walletBalance: number;
	max_devices: number;
	permissions: Permissions;
	isMaster: boolean;
	isAdmin: boolean;
	isAgent: boolean;
};

export type UserDetailsProfile = {
	name: string;
	email: string;
	phone: string;
};

const DEFAULT_VALUES = {
	name: '',
	email: '',
	phone: '',
	isSubscribed: false,
	subscription_expiry: '',
	walletBalance: 0,
	max_devices: 0,
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
};

const UserDetailsContext = React.createContext<{
	profile: UserDetailsType;
	setProfile: (details: Partial<UserDetailsType>) => void;
}>({
	profile: DEFAULT_VALUES,
	setProfile: () => {},
});

export function UserDetailsProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: UserDetailsType;
}) {
	const [userDetails, setUserDetails] = React.useState<UserDetailsType>(DEFAULT_VALUES);

	const setProfile = (details: Partial<UserDetailsType>) => {
		setUserDetails((prev) => {
			return {
				...prev,
				...details,
			};
		});
	};

	React.useEffect(() => {
		setUserDetails(data);
	}, [data]);

	return (
		<UserDetailsContext.Provider
			value={{
				profile: userDetails,
				setProfile,
			}}
		>
			{children}
		</UserDetailsContext.Provider>
	);
}

export const useUserDetailsSetter = () => React.useContext(UserDetailsContext).setProfile;
export const useUserDetails = () => React.useContext(UserDetailsContext).profile;
export const usePermissions = () => React.useContext(UserDetailsContext).profile.permissions;
