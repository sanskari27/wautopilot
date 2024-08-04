'use client';
import Show from '@/components/containers/show';
import { useAgents } from '@/components/context/agents';
import { useUserDetails } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DetailsDialog, PasswordDialog, PermissionDialog } from './_components/dialogs';
import Agents from './_components/table';

export default function AgentPage() {
	const searchParams = useSearchParams();
	const agents = useAgents();
	const { isAgent } = useUserDetails();

	return (
		<div className='flex flex-col gap-2 justify-center p-4'>
			<div className='flex justify-between'>
				<h1 className='text-2xl font-bold'>Agents</h1>
				<Show.ShowIf condition={!isAgent}>
					<Link href={'?edit=new'}>
						<Button size={'sm'}>
							<Plus className='mr-2 w-4 h-4' />
							Create Agent
						</Button>
					</Link>
				</Show.ShowIf>
			</div>
			<Agents agents={agents} canOpenContextMenu={!isAgent} />
			{searchParams.get('edit') && <DetailsDialog />}
			{searchParams.get('update-password') && <PasswordDialog />}
			{searchParams.get('permissions') && <PermissionDialog />}
		</div>
	);
}
