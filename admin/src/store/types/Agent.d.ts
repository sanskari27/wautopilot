export type Agent = {
	id: string;
	name: string;
	email: string;
	phone: string;
	password?: string;
	permissions: {
		assigned_labels: string[];
		view_broadcast_reports: boolean;
		create_broadcast: boolean;
		create_phonebook: boolean;
		update_phonebook: boolean;
		delete_phonebook: boolean;
		auto_assign_chats: boolean;
		create_template: boolean;
		update_template: boolean;
		delete_template: boolean;
		create_recurring_broadcast: boolean;
		manage_media: boolean;
		manage_contacts: boolean;
		manage_chatbot: boolean;
		manage_chatbot_flows: boolean;
	};
};

export type AgentPermission = {
	create_broadcast: boolean;
	assigned_labels: string[];
	view_broadcast_report: boolean;
	auto_assign_chats: boolean;
	create_recurring_broadcast: boolean;
	manage_media: boolean;
	manage_contacts: boolean;
	manage_chatbot: boolean;
	manage_chatbot_flows: boolean;
	can_manipulate_phonebook: {
		access: boolean;
		create_phonebook: boolean;
		update_phonebook: boolean;
		delete_phonebook: boolean;
	};
	can_manipulate_template: {
		access: boolean;
		create_template: boolean;
		update_template: boolean;
		delete_template: boolean;
	};
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
