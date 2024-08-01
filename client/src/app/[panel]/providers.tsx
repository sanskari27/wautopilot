'use client';

import { UserDetailsProvider, UserDetailsType } from '@/components/context/organization-details';

export function Providers({
	children,
	userDetails,
}: {
	children: React.ReactNode;
	userDetails: UserDetailsType;
}) {
	return <UserDetailsProvider data={userDetails}>{children}</UserDetailsProvider>;
}
