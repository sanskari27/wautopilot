'use client';

import {
	INVITE,
	INVITE2,
	ORG_TREE,
	ORGANIZATION_PHOTO,
	TASK_UPDATE,
	TASKS,
	TASKS_1,
	TASKS_2,
	TASKS_3,
} from '@/assets/image';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export function FeaturesSectionDemo() {
	const features = [
		{
			title: 'Effortless Organization Creation',
			description:
				'Easily create and manage organizations within our platform. Set up your company structure, define roles, and start assigning tasks in minutes.',
			skeleton: <SkeletonOne />,
			className: 'col-span-1 lg:col-span-4 border-b lg:border-r border-neutral-800',
		},
		{
			title: 'Seamless Team Invitations',
			description:
				'Invite team members to join your organization with a few clicks. Manage user access and permissions to ensure the right people have the right access.',
			skeleton: <SkeletonTwo />,
			className: 'border-b col-span-1 lg:col-span-2 border-neutral-800',
		},
		{
			title: ' Dynamic Organization Hierarchy',
			description:
				'As your organization evolves, so can your structure. Our platform allows owners to adjust the hierarchy and organizational tree effortlessly, keeping your workflow aligned with your business needs.',
			skeleton: <SkeletonThree />,
			className: 'col-span-1 lg:col-span-3 lg:border-r border-neutral-800',
		},
		{
			title: 'Rich Task Updates & Comprehensive Progress Tracking',
			description:
				'Enhance communication with detailed task updates using text, audio, images, and videos. Monitor progress and stay informed with a user-friendly interface that visualizes updates and status changes effectively.',
			skeleton: <SkeletonFour />,
			className: 'col-span-1 lg:col-span-3 border-b lg:border-none',
		},
		{
			title: 'Flexible Task Assignment',
			description:
				'Create tasks for single employees or multiple team members. Assign responsibilities with ease, ensuring everyone knows their role and deadlines.',
			skeleton: <SkeletonFive />,
			className:
				'border-t flex md:flex-row flex-col items-center col-span-1 lg:col-span-6 border-neutral-800',
		},
	];
	return (
		<div className='relative z-20 py-10 lg:py-40 max-w-7xl mx-auto'>
			<div className='px-8'>
				<h4 className='text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white'>
					Key Features
				</h4>
			</div>

			<div className='relative xl:border rounded-md border-neutral-800'>
				<div className='grid grid-cols-1 lg:grid-cols-6 mt-12 '>
					{features.map((feature) => (
						<FeatureCard key={feature.title} className={feature.className}>
							<div>
								<FeatureTitle>{feature.title}</FeatureTitle>
								<FeatureDescription>{feature.description}</FeatureDescription>
							</div>
							<div className='h-full w-full select-none'>{feature.skeleton}</div>
						</FeatureCard>
					))}
				</div>
			</div>
		</div>
	);
}

const FeatureCard = ({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) => {
	return <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>{children}</div>;
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
	return (
		<p className=' max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug'>
			{children}
		</p>
	);
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
	return (
		<p
			className={cn(
				'text-sm md:text-base  max-w-4xl text-left mx-auto',
				'text-center font-normal text-neutral-300',
				'text-left max-w-sm mx-0 md:text-sm my-2 select-none'
			)}
		>
			{children}
		</p>
	);
};

export const SkeletonOne = () => {
	return (
		<div className='relative flex py-2 px-2 gap-10 h-full'>
			<div className='w-full  p-5  mx-auto bgbg-neutral-900 shadow-2xl group h-full'>
				<div className='flex flex-1 w-full h-full flex-col space-y-2  select-none'>
					<CardContainer className='inter-var'>
						<CardBody className='bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl border'>
							<CardItem translateZ='100' className='w-full mt-4'>
								<Image
									lazyRoot='image'
									src={ORGANIZATION_PHOTO}
									alt='header'
									className='h-full w-full object-cover rounded-sm'
								/>
							</CardItem>
						</CardBody>
					</CardContainer>
				</div>
			</div>

			<div className='absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-black via-black to-transparent w-full pointer-events-none' />
			<div className='absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-black via-transparent to-transparent w-full pointer-events-none' />
		</div>
	);
};

export const SkeletonThree = () => {
	return (
		<div className='w-full  mx-auto bg-transparent group h-full'>
			<div className='flex flex-1 w-full h-full flex-col space-y-2  relative'>
				<CardContainer className='inter-var'>
					<CardBody className='bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl border'>
						<CardItem translateZ='100' className='w-full mt-4'>
							<Image
								src={ORG_TREE}
								alt='header'
								className='mt-4 w-full object-center  rounded-sm  select-none'
							/>
						</CardItem>
					</CardBody>
				</CardContainer>
			</div>
		</div>
	);
};

export const SkeletonTwo = () => {
	const images = [INVITE, INVITE2];

	const imageVariants = {
		whileHover: {
			scale: 1.2,
			rotate: 0,
			zIndex: 100,
		},
		whileTap: {
			scale: 1.2,
			rotate: 0,
			zIndex: 100,
		},
	};
	return (
		<div className='relative flex flex-col w-full items-center p-8 gap-10 h-full overflow-hidden'>
			<div className='flex flex-row '>
				{images.map((image, idx) => (
					<motion.div
						variants={imageVariants}
						key={'images-first' + idx}
						style={{
							rotate: Math.random() * 20 - 10,
						}}
						whileHover='whileHover'
						whileTap='whileTap'
						className='rounded-xl -mr-4 mt-4 p-1 bg-neutral-800 border-neutral-700 border flex-shrink-0 overflow-hidden'
					>
						<Image
							src={image}
							alt='bali images'
							width='200'
							height='200'
							className='rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0'
						/>
					</motion.div>
				))}
			</div>

			<div className='absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-black to-transparent  h-full pointer-events-none' />
			<div className='absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-black  to-transparent h-full pointer-events-none' />
		</div>
	);
};

export const SkeletonFour = () => {
	return (
		<div className='relative flex py-2 px-2 gap-10 h-full'>
			<div className='w-full  p-5  mx-auto bg-neutral-900 shadow-2xl group h-full'>
				<div className='flex flex-1 w-full h-full flex-col space-y-2  '>
					<CardContainer className='inter-var'>
						<CardBody className='bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl border'>
							<CardItem translateZ='100' className='w-full mt-4'>
								<Image
									lazyRoot='image'
									src={TASK_UPDATE}
									alt='header'
									className='w-full h-full object-cover rounded-sm'
								/>
							</CardItem>
						</CardBody>
					</CardContainer>
				</div>
			</div>

			<div className='absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-black via-black to-transparent w-full pointer-events-none' />
			<div className='absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-black via-transparent to-transparent w-full pointer-events-none' />
		</div>
	);
};

export const SkeletonFive = () => {
	const images = [TASKS, TASKS_1, TASKS_2, TASKS_3, TASK_UPDATE];

	const imageVariants = {
		whileHover: {
			scale: 1.2,
			rotate: 0,
			zIndex: 100,
		},
		whileTap: {
			scale: 1.2,
			rotate: 0,
			zIndex: 100,
		},
	};
	return (
		<div className='relative flex flex-col w-full items-center p-8 gap-10 h-full overflow-hidden'>
			{/* TODO */}
			<div className='flex flex-row '>
				{images.map((image, idx) => (
					<motion.div
						variants={imageVariants}
						key={'images-first' + idx}
						style={{
							rotate: Math.random() * 20 - 10,
						}}
						whileHover='whileHover'
						whileTap='whileTap'
						className='rounded-xl -mr-4 mt-4 p-1 bg-neutral-800 border-neutral-700 border flex-shrink-0 overflow-hidden'
					>
						<Image
							src={image}
							alt='bali images'
							width='500'
							height='500'
							className='rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0'
						/>
					</motion.div>
				))}
			</div>

			<div className='absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-black to-transparent  h-full pointer-events-none' />
			<div className='absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-black  to-transparent h-full pointer-events-none' />
		</div>
	);
};
