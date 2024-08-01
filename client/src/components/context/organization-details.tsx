'use client';

import * as React from 'react';

export type OrganizationDetailsType = {
	id: string;
	name: string;
	domain: string;
	industry: string;
	logo: string;
	timezone: string;
	address: {
		street: string;
		city: string;
		state: string;
		country: string;
		zip: string;
	};
	is_owner: boolean;
	categories: string[];
};

const OrganizationDetailsContext = React.createContext<OrganizationDetailsType>({
	id: '',
	name: '',
	domain: '',
	industry: '',
	logo: '',
	timezone: '',
	address: {
		street: '',
		city: '',
		state: '',
		country: '',
		zip: '',
	},
	categories: [],
	is_owner: false,
});

export function OrganizationDetailsProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: OrganizationDetailsType;
}) {
	return (
		<OrganizationDetailsContext.Provider value={data}>
			{children}
		</OrganizationDetailsContext.Provider>
	);
}

export const useOrganizationDetails = () => React.useContext(OrganizationDetailsContext);
