'use client';

import * as React from 'react';

const WhatsappFlowContext = React.createContext<
	{
		id: string;
		name: string;
		status: 'DRAFT' | 'PUBLISHED';
		categories: (
			| 'SIGN_UP'
			| 'SIGN_IN'
			| 'APPOINTMENT_BOOKING'
			| 'LEAD_GENERATION'
			| 'CONTACT_US'
			| 'CUSTOMER_SUPPORT'
			| 'SURVEY'
			| 'OTHER'
		)[];
	}[]
>([]);

export function WhatsappFlowProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: {
		id: string;
		name: string;
		status: 'DRAFT' | 'PUBLISHED';
		categories: (
			| 'SIGN_UP'
			| 'SIGN_IN'
			| 'APPOINTMENT_BOOKING'
			| 'LEAD_GENERATION'
			| 'CONTACT_US'
			| 'CUSTOMER_SUPPORT'
			| 'SURVEY'
			| 'OTHER'
		)[];
	}[];
}) {
	return <WhatsappFlowContext.Provider value={data}>{children}</WhatsappFlowContext.Provider>;
}

export const useWhatsappFlows = () => React.useContext(WhatsappFlowContext);
