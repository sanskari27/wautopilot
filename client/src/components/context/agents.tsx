'use client';

import { Agent } from '@/types/agent';
import * as React from 'react';

const AgentContext = React.createContext<Agent[]>([]);

export function AgentProvider({ children, data }: { children: React.ReactNode; data: Agent[] }) {
	return <AgentContext.Provider value={data}>{children}</AgentContext.Provider>;
}

export const useAgents = () => React.useContext(AgentContext);
