'use client';

import { InfiniteMovingCards } from '@/components/ui/testimonials';

export default function Testimonials({
	testimonials,
}: {
	testimonials: {
		quote: string;
		title: string;
		name: string;
	}[];
}) {
	return (
		<div className='h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden'>
			<InfiniteMovingCards items={testimonials} direction='right' speed='slow' />
		</div>
	);
}
