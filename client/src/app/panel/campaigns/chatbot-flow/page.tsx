import Each from '@/components/containers/each';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import { notFound } from 'next/navigation';
import { CreateButton } from './_components/buttons';
import { MainContextMenu } from './_components/context-menus';

export default async function ChatbotFlow({ params }: { params: { panel: string } }) {
	const list = await ChatbotFlowService.listChatBots();

	if (!list) {
		return notFound();
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Chatbot Flow</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<CreateButton />
				</div>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Trigger</TableHead>
							<TableHead>Condition</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-center'>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={list}
							render={(item) => (
								<TableRow>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.trigger.join(', ')}</TableCell>
									<TableCell className='capitalize'>
										{item.options.toLowerCase().replaceAll('_', ' ')}
									</TableCell>
									<TableCell>
										<Badge className={cn('rounded', item.isActive ? 'bg-green-500' : 'bg-red-500')}>
											{item.isActive ? 'Active' : 'Inactive'}
										</Badge>
									</TableCell>
									<TableCell className='text-center'>
										<MainContextMenu details={item}>
											<Button variant={'outline'} size={'sm'}>
												Actions
											</Button>
										</MainContextMenu>
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
