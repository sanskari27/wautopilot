export type Agent = {
	id: string;
	name: string;
	email: string;
	phone: string;
	password?: string;
	permissions: AgentPermission;
};

export type AgentPermission = {
	phonebook: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	chatbot: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	chatbot_flow: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	broadcast: {
		create: boolean;
		update: boolean;
		report: boolean;
		export: boolean;
	};
	recurring: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	media: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	contacts: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	template: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	buttons: {
		read: boolean;
		export: boolean;
	};
	auto_assign_chats: boolean;
	assigned_labels: string[];
};

export type AgentState = {
	list: Agent[];
	details: Agent;
	agentPermissions: AgentPermission;
	selectedAgent: string[];
	ui: {
		loading: boolean;
	};
};
