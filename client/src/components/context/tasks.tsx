'use client';

import { Task } from '@/types/task';
import * as React from 'react';

const TasksContext = React.createContext<Task[]>([]);

export function TasksProvider({ children, data }: { children: React.ReactNode; data: Task[] }) {
	return <TasksContext.Provider value={data}>{children}</TasksContext.Provider>;
}

export const useTasks = () => React.useContext(TasksContext);
