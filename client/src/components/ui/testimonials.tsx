'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { Meteors } from './meteors';

export const InfiniteMovingCards = ({
	items,
	direction = 'left',
	speed = 'fast',
	pauseOnHover = true,
	className,
}: {
	items: {
		description: string;
		name: string;
		title: string;
	}[];
	direction?: 'left' | 'right';
	speed?: 'fast' | 'normal' | 'slow';
	pauseOnHover?: boolean;
	className?: string;
}) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const scrollerRef = React.useRef<HTMLUListElement>(null);

	const [start, setStart] = useState(false);

	useEffect(() => {
		const getDirection = () => {
			if (containerRef.current) {
				if (direction === 'left') {
					containerRef.current.style.setProperty('--animation-direction', 'forwards');
				} else {
					containerRef.current.style.setProperty('--animation-direction', 'reverse');
				}
			}
		};
		const getSpeed = () => {
			if (containerRef.current) {
				if (speed === 'fast') {
					containerRef.current.style.setProperty('--animation-duration', '20s');
				} else if (speed === 'normal') {
					containerRef.current.style.setProperty('--animation-duration', '40s');
				} else {
					containerRef.current.style.setProperty('--animation-duration', '80s');
				}
			}
		};

		if (containerRef.current && scrollerRef.current) {
			const scrollerContent = Array.from(scrollerRef.current.children);

			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				if (scrollerRef.current) {
					scrollerRef.current.appendChild(duplicatedItem);
				}
			});

			getDirection();
			getSpeed();
			setStart(true);
		}
	}, [direction, speed]);

	return (
		<div
			ref={containerRef}
			className={cn(
				'scroller flex items-center relative z-20 h-full w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
				className
			)}
		>
			<ul
				ref={scrollerRef}
				className={cn(
					' flex min-w-full shrink-0 gap-8 w-max flex-nowrap',
					start && 'animate-scroll ',
					pauseOnHover && 'hover:[animation-play-state:paused]'
				)}
			>
				{items.map((item, idx) => (
					<li key={idx} className=''>
						<div className='w-full relative max-w-md'>
							<div className='absolute inset-0 h-full w-full bg-gradient-to-r from-green-500 to-green-200 transform scale-[0.80] bg-red-500 rounded-full blur-3xl' />
							<div className='w-full min-h-[350px] relative shadow-xl bg-primary-foreground border border-primary  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-start items-start'>

								<h1 className='font-bold text-xl text-primary mb-4 relative z-50'>
									{item.title}
								</h1>

								<p className='font-normal text-base text-primary mb-4 relative z-50'>
									{item.description}
								</p>

								<p className='mt-auto font-normal text-base text-emerald-700 mb-4 relative z-50'>
									{item.name}
								</p>
								<Meteors number={20} />
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
