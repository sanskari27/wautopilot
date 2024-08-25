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
import {
	DeleteAPIKey,
	DeleteWebhookButton,
	RegenerateAPIKey,
	ValidateWebhook,
} from './_components/button';
import { CreateAPIKeyDialog, CreateWebhookDialog } from './_components/dialogs';

export default async function APIWebhookPage() {
	const APIList = await APIWebhookService.listKeys();
	const webhookList = await APIWebhookService.listWebhook();
	if (!APIList) return null;
	if (!webhookList) return null;

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
							<TableHead className='w-[20%]'>Name</TableHead>
							<TableHead className='w-[60%]'>Device</TableHead>
							<TableHead className='text-right w-[10%]'>Created At</TableHead>
							<TableHead className='w-[10%] text-center'>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={APIList}
							render={(item) => (
								<TableRow>
									<TableCell className='font-medium'>{item.name}</TableCell>
									<TableCell className='font-medium'>{item.device}</TableCell>
									<TableCell className='font-medium'>{item.createdAt}</TableCell>
									<TableCell className='font-medium flex gap-2 justify-center'>
										<RegenerateAPIKey id={item.id} />
										<DeleteAPIKey id={item.id} />
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			<div className='flex justify-between mt-4'>
				<h1 className='text-2xl font-bold'>Webhook</h1>
				<Link href={'?webhook=create'}>
					<Button size={'sm'}>
						<Plus className='mr-2 w-4 h-4' />
						Create Webhook
					</Button>
				</Link>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[20%]'>Name</TableHead>
							<TableHead className='w-[20%]'>Device</TableHead>
							<TableHead className='w-[40%]'>URL</TableHead>
							<TableHead className='text-right'>Created At</TableHead>
							<TableHead className='text-center w-[10%]'>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={webhookList}
							render={(item) => (
								<TableRow>
									<TableCell className='font-medium'>{item.name}</TableCell>
									<TableCell className='font-medium'>{item.device}</TableCell>
									<TableCell className='font-medium whitespace-pre-wrap'>{item.url}</TableCell>
									<TableCell className='font-medium text-right'>{item.created_at}</TableCell>
									<TableCell className='font-medium justify-center flex gap-2'>
										<ValidateWebhook id={item.id} />
										<DeleteWebhookButton id={item.id} />
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			<CreateAPIKeyDialog />
			<CreateWebhookDialog />
		</div>
	);
}
