import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Task } from '@/types/task';
import TaskCard from './card';
import { Column, ColumnRow } from './column';

export default function DataGrid({
	organizationId,
	notStarted,
	inProgress,
	completed,
}: {
	organizationId:string;
	notStarted: Task[];
	inProgress: Task[];
	completed: Task[];
}) {
	return (
		<div className='flex gap-3 mt-6 flex-wrap'>
			<div className='flex-1 min-w-[400px] order-2 lg:order-1'>
				<Column id='pending'>
					<div className='flex flex-col gap-3 border rounded-xl p-4 w-full  md:min-h-[300px]'>
						<p className='font-bold text-center pb-3  border-b w-full border-dashed '>
							Not Started
						</p>
						<Show>
							<Show.When condition={notStarted.length > 0}>
								<Each
									items={notStarted}
									render={(item) => (
										<ColumnRow item={item}>
											<TaskCard task={item} organizationId={organizationId} />
										</ColumnRow>
									)}
								/>
							</Show.When>
							<Show.Else>
								<div className='md:min-h-[200px] w-full flex justify-center items-center '>
									<p>No tasks pending</p>
								</div>
							</Show.Else>
						</Show>
					</div>
				</Column>
			</div>
			<div className='flex-1 min-w-[400px] order-1 lg:order-2'>
				<Column id='in_progress'>
					<div className='flex flex-col gap-3 border rounded-xl p-4 w-full  md:min-h-[300px]'>
						<p className='font-bold text-center pb-3  border-b w-full border-dashed '>
							In Progress
						</p>
						<Show>
							<Show.When condition={inProgress.length > 0}>
								<Each
									items={inProgress}
									render={(item) => (
										<ColumnRow item={item}>
											<TaskCard task={item} organizationId={organizationId} />
										</ColumnRow>
									)}
								/>
							</Show.When>
							<Show.Else>
								<div className='md:min-h-[200px] w-full flex justify-center items-center '>
									<p>No tasks in progress</p>
								</div>
							</Show.Else>
						</Show>
					</div>
				</Column>
			</div>
			<div className='flex-1 min-w-[400px] order-3'>
				<Column id='completed'>
					<div className='flex flex-col gap-3 border rounded-xl p-4 w-full md:min-h-[300px]'>
						<p className='font-bold text-center pb-3  border-b w-full border-dashed '>Completed</p>
						<Show>
							<Show.When condition={completed.length > 0}>
								<Each
									items={completed}
									render={(item) => (
										<ColumnRow item={item}>
											<TaskCard task={item} organizationId={organizationId} />
										</ColumnRow>
									)}
								/>
							</Show.When>
							<Show.Else>
								<div className='md:min-h-[200px] w-full flex justify-center items-center '>
									<p>No tasks completed</p>
								</div>
							</Show.Else>
						</Show>
					</div>
				</Column>
			</div>
		</div>
	);
}
