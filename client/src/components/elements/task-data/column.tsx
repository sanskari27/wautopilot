'use client';

import { DraggableContainer, DroppableContainer } from '@/components/containers/draggable';
import { cn } from '@/lib/utils';
import TasksService from '@/services/tasks.service';
import { Task } from '@/types/task';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-hot-toast';

const Column = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		id: Task['status'];
	}
>(({ className, id, ...props }, ref) => {
	const router = useRouter();
	const pathname = usePathname();
	const org_id = pathname.split('/')[2];
	const handleDrop = (data: Task) => {
		if (id === data.status) return;
		const promise = TasksService.updateStatus(org_id, {
			taskId: data.id,
			status: id,
		});
		toast.promise(promise, {
			loading: 'Updating...',
			success: () => {
				router.refresh();
				return 'Task updated successfully';
			},
			error: 'Failed to update task',
		});
	};

	return (
		<DroppableContainer
			className={cn('rounded-xl border border-transparent', className)}
			ref={ref}
			{...props}
			onDrop={(data) => handleDrop(data as Task)}
		/>
	);
});

Column.displayName = 'Column';

const ColumnRow = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		item: Task;
	}
>(({ className, item, ...props }, ref) => {

	return (
		<DraggableContainer
			ref={ref}
			{...props}
			draggableData={item}
		/>
	);
});

ColumnRow.displayName = 'ColumnRow';

export { Column, ColumnRow };
