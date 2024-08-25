'use client';
import { usePermissions } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function CreateButton() {
	const { create: createPermission } = usePermissions().chatbot;

	if (!createPermission) return null;
	return (
		<Link href={`/panel/campaigns/chatbot/create`}>
			<Button size={'sm'}>
				<Plus className='w-4 h-4 mr-2' />
				Create New
			</Button>
		</Link>
	);
}
