'use client';

import { Button } from '@/components/ui/button';
import AgentService from '@/services/agent.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Task = {
	id: string;
	hidden: boolean;
	message: string;
	due_date: string;
};

export default function TaskItem({ id, message, hidden, due_date }: Task) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const hideTask = () => {
		setLoading(true);
		AgentService.hideAssignedTask(id).then(() => {
			setLoading(false);
			router.refresh();
		});
	};
	return (
		<div className='px-3 py-2 bg-gray-100 rounded-xl whitespace-pre-wrap'>
			<span className='font-medium'>{due_date}</span> {message}
			<Button
				variant={'default'}
				size={'sm'}
				className='bg-primary ml-4 '
				disabled={hidden || loading}
				onClick={hideTask}
			>
				<span className='!font-bold'>{hidden ? 'Completed' : 'Mark Completed'}</span>
			</Button>
		</div>
	);
}
