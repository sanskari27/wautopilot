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
import ChatBotService from '@/services/chatbot.service';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsappFlowContextMenu from './_components/context-menus';
import { WhatsappFlowDialog } from './_components/dialogs';

export default async function WhatsappFlow({ params }: { params: { panel: string } }) {
	const list = await ChatBotService.listWhatsappFlows();

	if (!list) {
		return notFound();
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Whatsapp Flow</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Link href={`/panel/campaigns/whatsapp-flow?flow=create`}>
						<Button size={'sm'}>
							<Plus size={16} className='mr-2' />
							Create New
						</Button>
					</Link>
				</div>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Categories</TableHead>
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
									<TableCell>{item.categories.join(', ')}</TableCell>
									<TableCell>{item.status}</TableCell>
									<TableCell className='text-center'>
										<WhatsappFlowContextMenu
											id={item.id}
											details={{
												name: item.name,
												categories: item.categories,
												status: item.status,
											}}
										>
											<Button variant={'outline'} size={'sm'}>
												Actions
											</Button>
										</WhatsappFlowContextMenu>
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			<WhatsappFlowDialog />
		</div>
	);
}
