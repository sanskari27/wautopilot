'use client';

import Each from '@/components/containers/each';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn, getInitials } from '@/lib/utils';
import { Agent } from '@/types/agent';
import { useRouter } from 'next/navigation';
import { ReactNode, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AssignTask } from '../action';

export default function AssignTaskDialog({
	children,
	agents,
}: {
	children: ReactNode;
	agents: Agent[];
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);

	const router = useRouter();

	const [selectedAgent, setSelectedAgent] = useState('me');
	const [selectedDate, setSelectedDate] = useState('');
	const [message, setMessage] = useState('');

	const handleSave = () => {
		if (!selectedDate || !message) {
			return toast.error('Please fill all fields');
		}

		toast.promise(
			AssignTask(message, selectedDate, selectedAgent !== 'me' ? selectedAgent : undefined),
			{
				loading: 'Assigning Task',
				success: () => {
					router.replace(`/panel/home/tasks`);
					router.refresh();
					buttonRef.current?.click();
					setMessage('');
					setSelectedDate('');
					setSelectedAgent('me');
					return 'Task Assigned Successfully';
				},
				error: 'Failed to Assign Task',
			}
		);
	};

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Assign Task</DialogTitle>
				</DialogHeader>
				<div className='flex flex-wrap gap-4 border-2 border-dashed p-2 rounded-lg'>
					<Badge
						className={cn(
							'rounded-full cursor-pointer',
							selectedAgent === 'me' ? 'bg-green-500' : 'bg-gray-300',
							selectedAgent === 'me' ? 'text-white' : 'text-black'
						)}
						onClick={() => setSelectedAgent('me')}
					>
						<Avatar className='h-6 w-6 -ml-1 mr-2 font-medium'>
							<AvatarFallback>Me</AvatarFallback>
						</Avatar>
						<span className='font-medium'>Me</span>
					</Badge>
					<Each
						items={agents}
						render={(item) => (
							<Badge
								className={cn(
									'rounded-full cursor-pointer',
									selectedAgent === item.id ? 'bg-green-500' : 'bg-gray-300',
									selectedAgent === item.id ? 'text-white' : 'text-black'
								)}
								onClick={() => {
									setSelectedAgent(item.id);
								}}
							>
								<Avatar className='h-6 w-6 -ml-1 mr-2 font-medium'>
									<AvatarFallback>{getInitials(item.name) || 'NA'}</AvatarFallback>
								</Avatar>
								<span className='font-medium'>{item.name}</span>
							</Badge>
						)}
					/>
				</div>
				<div>
					<p>
						Due Date<span className='ml-[0.2rem] text-red-800'>*</span>
					</p>
					<Input
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						type='datetime-local'
						placeholder='Task name'
					/>
				</div>
				<div>
					<Textarea
						className='h-[400px]'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder='Write a message to the agent. You can also add instructions, links or any information here.'
					/>
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
