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
import { TestimonialsContextMenu } from './ContextMenu';
import { TestimonialDialog } from './dialogs';

export default async function TestimonialsPage() {
	const list = await ExtraService.getTestimonials();

	if (!list) {
		return notFound();
	}

	return (
		<div className='flex flex-col'>
			<div className='flex gap-2 justify-between'>
				<h1 className='text-2xl font-semibold'>FAQ</h1>
				<Link href='?testimonials=create'>
					<Button>
						<Plus size={16} />
						Create Testimonials
					</Button>
				</Link>
			</div>
			<Table className='border-2 border-dashed mt-4 rounded-lg'>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[5%]'>Sl. no.</TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Info</TableHead>
						<TableHead>Description</TableHead>
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
								<TableCell className='whitespace-pre-wrap'>{item.name}</TableCell>
								<TableCell className='whitespace-pre-wrap'>{item.description}</TableCell>
								<TableCell className='text-center'>
									<TestimonialsContextMenu list={list} id={index} testimonial={item}>
										<Button size='sm' variant={'outline'}>
											Edit
										</Button>
									</TestimonialsContextMenu>
								</TableCell>
							</TableRow>
						)}
					/>
				</TableBody>
			</Table>
			<TestimonialDialog list={list} />
		</div>
	);
}
