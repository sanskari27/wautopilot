'use client';
import { usePermissions } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CreateButton() {
	const { create: createPermission } = usePermissions().chatbot_flow;

	if (!createPermission) return null;
	return (
		<Link href={`/panel/campaigns/chatbot-flow/new`}>
			<Button size={'sm'}>Create New</Button>
		</Link>
	);
}
