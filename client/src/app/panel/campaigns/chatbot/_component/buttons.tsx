'use client';
import { usePermissions } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CreateButton() {
	const { create: createPermission } = usePermissions().chatbot;

	if (!createPermission) return null;
	return (
		<Link href={`/panel/campaigns/chatbot/create`}>
			<Button variant={'outline'} size={'sm'}>
				Create New
			</Button>
		</Link>
	);
}
