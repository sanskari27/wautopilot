'use client';

import Each from '@/components/containers/each';
import { Button } from '@/components/ui/button';
import AgentService from '@/services/agent.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function List({
	list,
}: {
	list: {
		id: string;
		hidden: boolean;
		message: string;
		due_date: string;
	}[];
}) {
	return <Each items={list} key={'id'} render={(item) => <TaskItem {...item} />} />;
}

type Task = {
	id: string;
	hidden: boolean;
	message: string;
	due_date: string;
};

function TaskItem({ id, message, hidden, due_date }: Task) {
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
				type='submit'
				variant={'default'}
				size={'xs'}
				className='ml-4 text-sm'
				disabled={hidden || loading}
				onClick={hideTask}
			>
				<span className='!font-bold'>{hidden ? 'Completed' : 'Mark Completed'}</span>
			</Button>
		</div>
	);
}
