import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCellLink,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import RecurringService from '@/services/recurring.service';
import Link from 'next/link';

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
					<Show.ShowIf condition>
						<Link href={`/${panel}/campaigns/recurring/create`}>
							<Button variant={'outline'} size={'sm'}>
								Create New
							</Button>
						</Link>
					</Show.ShowIf>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Wish Type</TableHead>
						<TableHead className='text-right'>Delay</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Each
						items={list}
						render={(recurring) => {
							const link = `/${panel}/campaigns/recurring/${recurring.id}?data=${JSON.stringify(
								recurring
							)}`;
							return (
								<TableRow>
									<TableCellLink href={link} className='font-medium'>
										{recurring.name}
									</TableCellLink>
									<TableCellLink href={link}>{recurring.description}</TableCellLink>
									<TableCellLink href={link}>{recurring.wish_from}</TableCellLink>
									<TableCellLink href={link} className='text-right'>
										{recurring.delay} Days
									</TableCellLink>
								</TableRow>
							);
						}}
					/>
				</TableBody>
			</Table>
		</div>
	);
}
