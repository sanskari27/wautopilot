'use client';

import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createFAQs, createTestimonials } from '../action';

export function FAQContextMenu({
	children,
	id,
	FAQ,
	list,
}: {
	children: React.ReactNode;
	id: number;
	FAQ: { title: string; info: string };
	list: { title: string; info: string }[];
}) {
	const handleDeleteFAQ = () => {
		const newList = list.filter((_, i) => i !== id);
		toast.promise(createFAQs(newList), {
			loading: 'Deleting FAQ',
			success: () => {
				return 'FAQ Deleted';
			},
			error: () => {
				return 'Error while deleting FAQ';
			},
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent>
				<Link href={`?faq=${id}&data=${JSON.stringify(FAQ)}`}>
					<DropdownMenuItem>Edit</DropdownMenuItem>
				</Link>
				<DeleteDialog onDelete={handleDeleteFAQ} action='FAQ'>
					<Button variant={'destructive'} size={'sm'} className='w-full'>
						<span className='mr-auto'>Delete</span>
					</Button>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function TestimonialsContextMenu({
	children,
	id,
	testimonial,
	list,
}: {
	children: React.ReactNode;
	id: number;
	testimonial: {
		description: string;
		name: string;
		title: string;
		photo_url: string;
	};
	list: {
		description: string;
		name: string;
		title: string;
		photo_url: string;
	}[];
}) {
	const handleDeleteTestimonial = () => {
		const newList = list.filter((_, i) => i !== id);
		toast.promise(createTestimonials(newList), {
			loading: 'Deleting Testimonial',
			success: () => {
				return 'Testimonial Deleted';
			},
			error: () => {
				return 'Error while deleting Testimonial';
			},
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent>
				<Link href={`?testimonial=${id}&data=${JSON.stringify(testimonial)}`}>
					<DropdownMenuItem>Edit</DropdownMenuItem>
				</Link>
				<DeleteDialog onDelete={handleDeleteTestimonial} action='Testimonial'>
					<Button variant={'destructive'} size={'sm'} className='w-full'>
						<span className='mr-auto'>Delete</span>
					</Button>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
