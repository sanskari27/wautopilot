export type Agent = {
	id: string;
	name: string;
	email: string;
	phone: string;
    password?:string
};

export type AgentState = {
	list: Agent[];
	details: Agent;
	selectedAgent: string[];
	ui: {
		loading: boolean;
	};
};
