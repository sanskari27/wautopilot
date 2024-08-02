import Each from '@/components/containers/each';

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Permissions } from '@/types/permissions';
import { AgentContextMenu } from './contextMenu';

export default function Agents({
	agents,
	canOpenContextMenu,
}: {
	agents: {
		id: string;
		name: string;
		email: string;
		phone: string;
		permissions: Permissions;
	}[];
	canOpenContextMenu?: boolean;
}) {
	return (
		<div className='border border-dashed border-gray-700 rounded-2xl'>
			<Table>
				<TableCaption>{agents.length} Agents Found.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className=''>Name</TableHead>
						<TableHead className='w-[40%]'>Email</TableHead>
						<TableHead className='text-right'>Phone</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Each
						items={agents}
						render={(agent) => (
							<AgentContextMenu id={agent.id} disabled={!canOpenContextMenu} agent={agent}>
								<TableRow className='cursor-context-menu'>
									<TableCell className='font-medium'>{agent.name}</TableCell>
									<TableCell className='w-[40%]'>
										<a href={`mailto:${agent.email}`}>{agent.email}</a>
									</TableCell>
									<TableCell className='text-right'>
										<a href={`tel:${agent.phone}`}>+{agent.phone}</a>
									</TableCell>
								</TableRow>
							</AgentContextMenu>
						)}
					/>
				</TableBody>
			</Table>
		</div>
	);
}
