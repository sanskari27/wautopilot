'use client';

import { Agent } from '@/types/agent';
import * as React from 'react';

const AgentContext = React.createContext<{
	list: Agent[];
	search: string;
	setSearchText: (text: string) => void;
}>({
	list: [],
	search: '',
	setSearchText: (text) => {},
});

export function AgentProvider({ children, data }: { children: React.ReactNode; data: Agent[] }) {
	const [search, setSearch] = React.useState('');
	const [admins, setAdmins] = React.useState<Agent[]>(data);

	const list = admins.filter(
		(admin) =>
			admin.name.toLowerCase().includes(search.toLowerCase()) ||
			admin.email.toLowerCase().includes(search.toLowerCase()) ||
			admin.phone.toLowerCase().includes(search.toLowerCase())
	);
	return (
		<AgentContext.Provider
			value={{
				list: list,
				search: '',
				setSearchText: (text) => {
					setSearch(text);
				},
			}}
		>
			{children}
		</AgentContext.Provider>
	);
}

export const useAgents = () => React.useContext(AgentContext);
export const useAgentSearch = () => React.useContext(AgentContext).setSearchText;
