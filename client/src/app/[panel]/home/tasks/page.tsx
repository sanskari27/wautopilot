import { Button } from '@/components/ui/button';
import AgentService from '@/services/agent.service';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import AssignTaskDialog from './_components/assign-task-dialog';
import { FilterAgent } from './_components/filter-agent';
import { FilterDate } from './_components/filter-date';
import List from './_components/list';

export default async function Tasks({
	searchParams,
}: {
	searchParams: {
		start: string;
		end: string;
		hidden: string;
		agent: string;
	};
}) {
	const showHidden = searchParams.hidden === 'true';
	const agent = searchParams.agent ?? 'me';
	const agents = await AgentService.getAgents()!;

	const startDate = searchParams.start
		? new Date(searchParams.start)
		: new Date(new Date().setFullYear(new Date().getFullYear() - 1));

	const endDate = searchParams.end ? new Date(searchParams.end) : new Date();

	const tasks = await AgentService.getAssignedTasks(agent, {
		date_from: startDate.toISOString(),
		date_to: endDate.toISOString(),
	});

	const filteredList = tasks.filter((item) => showHidden || item.hidden === showHidden);

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='flex justify-between'>
				<h2 className='text-2xl font-bold'>Tasks</h2>
				<AssignTaskDialog agents={agents}>
					<Button variant={'outline'}>
						<Plus className='h-4 w-4' />
						<span>Assign task</span>
					</Button>
				</AssignTaskDialog>
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<FilterAgent agents={agents} selectedAgent={agent} />
			</Suspense>
			<FilterDate />

			<p className='text-center text-sm underline -mt-4'>
				From {startDate.toDateString()} to {endDate.toDateString()}
			</p>
			<div className='w-full border border-dashed border-gray-700 rounded-xl py-4 -mt-4'>
				<p className='text-center font-medium text-2xl underline'>Assigned Tasks</p>

				<div className='flex flex-col gap-4 mx-4 mt-4'>
					{filteredList.length === 0 && (
						<p className='text-center font-medium'>No tasks assigned .</p>
					)}
					<List list={filteredList} />
				</div>
			</div>
			<div>
				<p className='text-center'>Mark completed by clicking completed button.</p>
			</div>
		</div>
	);
}
