import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { AgentContextMenu } from './_components/contextMenu';
import { DetailsDialog, PasswordDialog, PermissionDialog } from './_components/dialogs';

export default async function AgentPage({
	searchParams: { edit, update_password, permissions },
}: {
	searchParams: {
		edit: string;
		update_password: string;
		permissions: string;
	};
}) {
	const agents = await AgentService.getAgents();
	const { isAgent } = (await AuthService.userDetails())!;

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
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableCaption>{agents.length} Agents Found.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className=''>Name</TableHead>
							<TableHead className='w-[40%]'>Email</TableHead>
							<TableHead className='text-right'>Phone</TableHead>
							<TableHead className='text-center'>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={agents}
							render={(agent) => (
								<TableRow>
									<TableCell className='font-medium'>{agent.name}</TableCell>
									<TableCell className='w-[40%]'>
										<a href={`mailto:${agent.email}`}>{agent.email}</a>
									</TableCell>
									<TableCell className='text-right'>
										<a href={`tel:${agent.phone}`}>+{agent.phone}</a>
									</TableCell>
									<TableCell className='text-center'>
										<AgentContextMenu id={agent.id} disabled={isAgent} agent={agent}>
											<Button size={'sm'} variant={'outline'}>
												Edit
											</Button>
										</AgentContextMenu>
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			{edit && <DetailsDialog />}
			{update_password && <PasswordDialog />}
			{permissions && <PermissionDialog />}
		</div>
	);
}
