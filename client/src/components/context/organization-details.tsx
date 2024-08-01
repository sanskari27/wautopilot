'use client';

import * as React from 'react';

export type UserDetailsType = {
	name: string;
	email: string;
	phone: string;
	isSubscribed: boolean;
	subscription_expiry: string;
	walletBalance: number;
	no_of_devices: number;
};

const UserDetailsContext = React.createContext<UserDetailsType>({
	name: '',
	email: '',
	phone: '',
	isSubscribed: false,
	subscription_expiry: '',
	walletBalance: 0,
	no_of_devices: 0,
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
