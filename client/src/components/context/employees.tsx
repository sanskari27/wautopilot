'use client';

import { TEmployee } from '@/types/employee';
import * as React from 'react';

const EmployeesContext = React.createContext<TEmployee[]>([]);

export function EmployeesProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: TEmployee[];
}) {
	return <EmployeesContext.Provider value={data}>{children}</EmployeesContext.Provider>;
}

export const useEmployees = () => React.useContext(EmployeesContext);
