'use client';
import { useUserDetails } from '@/components/context/organization-details';

export default function DashboardPage() {
	const details = useUserDetails();

	return <>{details.name}</>;
}
