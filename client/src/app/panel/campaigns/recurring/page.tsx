import Each from '@/components/containers/each';
import { Button } from '@/components/ui/button';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import RecurringService from '@/services/recurring.service';
import { CreateButton } from './_components/buttons';
import RecurringActionContextMenu from './_components/context-menu';

export default async function Recurring({
	params: { panel },
}: {
	params: {
		panel: string;
	};
}) {
	const list = await RecurringService.getRecurringList();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Recurring</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<CreateButton />
				</div>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Wish Type</TableHead>
							<TableHead className='text-right'>Delay</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-center'>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={list}
							render={(recurring) => (
								<TableRow>
									<TableCell className='font-medium'>{recurring.name}</TableCell>
									<TableCell>{recurring.description}</TableCell>
									<TableCell>{recurring.wish_from}</TableCell>
									<TableCell className='text-right'>{recurring.delay} Days</TableCell>
									<TableCell>{recurring.active}</TableCell>
									<TableCell className='text-center'>
										<RecurringActionContextMenu
											recurring={recurring}
											active={recurring.active}
											campaignId={recurring.id}
										>
											<Button variant={'outline'} size={'sm'}>
												Actions
											</Button>
										</RecurringActionContextMenu>
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
