'use client';
import { usePermissions } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function CreateButton() {
	const { panel } = useParams();
	const { create: createPermission } = usePermissions().chatbot;

	if (!createPermission) return null;
	return (
		<Link href={`/${panel}/campaigns/chatbot/create`}>
			<Button variant={'outline'} size={'sm'}>
				Create New
			</Button>
		</Link>
	);
}
