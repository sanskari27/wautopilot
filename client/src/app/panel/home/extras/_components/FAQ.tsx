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
import ExtraService from '@/services/extra.service';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FAQContextMenu } from './ContextMenu';
import { FAQDialog } from './dialogs';

export default async function FAQPage() {
	const list = await ExtraService.getFAQs();

	if (!list) {
		return notFound();
	}

	return (
		<div className='flex flex-col'>
			<div className='flex gap-2 justify-between mb-4'>
				<h1 className='text-2xl font-semibold'>FAQ</h1>
				<Link href='?faq=create'>
					<Button>
						<Plus size={16} />
						Create FAQ
					</Button>
				</Link>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[5%]'>Sl. no.</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Info</TableHead>
							<TableHead className='text-center w-10%'>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={list}
							render={(item, index) => (
								<TableRow key={item.title}>
									<TableCell>{index + 1}</TableCell>
									<TableCell className='whitespace-pre-wrap'>{item.title}</TableCell>
									<TableCell className='whitespace-pre-wrap'>{item.info}</TableCell>
									<TableCell className='text-center'>
										<FAQContextMenu list={list} id={index} FAQ={item}>
											<Button size='sm' variant={'outline'}>
												Action
											</Button>
										</FAQContextMenu>
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			<FAQDialog list={list} />
		</div>
	);
}
