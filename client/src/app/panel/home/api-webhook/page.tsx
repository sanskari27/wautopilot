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
import APIWebhookService from '@/services/apiwebhook.service';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DeleteAPIKey, RegenerateAPIKey } from './_components/button';
import { CreateAPIKeyDialog } from './_components/dialogs';

export default async function APIWebhookPage() {
	const list = await APIWebhookService.listKeys();

	return (
		<div className='flex flex-col gap-2 justify-center p-4'>
			<div className='flex justify-between'>
				<h1 className='text-2xl font-bold'>API keys</h1>
				<Link href={'?token=create'}>
					<Button size={'sm'}>
						<Plus className='mr-2 w-4 h-4' />
						Create Token
					</Button>
				</Link>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[30%]'>Name</TableHead>
							<TableHead className='w-[60%]'>Device</TableHead>
							<TableHead className='w-[10%]'>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={list}
							render={(item) => (
								<TableRow>
									<TableCell className='font-medium'>{item.name}</TableCell>
									<TableCell className='font-medium'>{item.device}</TableCell>
									<TableCell className='font-medium flex gap-2'>
										<DeleteAPIKey id={item.id} />
										<RegenerateAPIKey id={item.id} />
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			<h1 className='text-2xl font-bold'>Webhook</h1>
			<CreateAPIKeyDialog />
		</div>
	);
}
