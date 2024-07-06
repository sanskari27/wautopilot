/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

export default class AgentService {
	static async getAgent() {
		try {
			const { data } = await APIInstance.get('/users/agents');
			return (data.list ?? []).map((agent: any) => {
				return {
					id: agent.id ?? '',
					name: agent.name ?? '',
					email: agent.email ?? '',
					phone: agent.phone ?? '',
					permissions: {
						assigned_labels: agent.permissions?.assigned_labels ?? [],
						view_broadcast_reports: agent.permissions?.view_broadcast_reports ?? false,
						create_broadcast: agent.permissions?.create_broadcast ?? false,
						create_phonebook: agent.permissions?.create_phonebook ?? false,
						update_phonebook: agent.permissions?.update_phonebook ?? false,
						delete_phonebook: agent.permissions?.delete_phonebook ?? false,
						auto_assign_chats: agent.permissions?.auto_assign_chats ?? false,
						create_template: agent.permissions?.create_template ?? false,
						update_template: agent.permissions?.update_template ?? false,
						delete_template: agent.permissions?.delete_template ?? false,
						create_recurring: agent.permissions?.create_recurring ?? false,
					},
				};
			});
		} catch (err) {
			//ignore
		}
	}

	static async createAgent(agent: {
		name: string;
		email: string;
		phone: string;
		password: string;
	}) {
		try {
			const { data } = await APIInstance.post('/users/agents', agent);
			return {
				id: data.id ?? '',
				name: data.name ?? '',
				email: data.email ?? '',
				phone: data.phone ?? '',
			};
		} catch (err) {
			throw new Error('Email already exists');
		}
	}

	static async updateAgent(agent: {
		id: string;
		name: string;
		email: string;
		phone: string;
		password: string;
	}) {
		try {
			const { data } = await APIInstance.post(`/users/agents/${agent.id}`, agent);
			return data;
		} catch (err) {
			throw new Error('Agent not found');
		}
	}

	static async deleteAgent(agentId: string) {
		APIInstance.delete(`/users/agents/${agentId}`);
	}

	static async assignConversationToAgent({
		device_id,
		agentId,
		conversationId,
	}: {
		device_id: string;
		agentId: string;
		conversationId: string;
	}) {
		APIInstance.post(`/${device_id}/conversation/${conversationId}/assign-agent/${agentId}`);
	}

	static async removeConversationFromAgent({
		device_id,
		conversationId,
	}: {
		device_id: string;
		conversationId: string;
	}) {
		APIInstance.post(`/${device_id}/conversation/${conversationId}/remove-agent`);
	}

	static async assignAgentPermission({
		agentId,
		permission,
	}: {
		agentId: string;
		permission: {
			manage_media: boolean;
			manage_contacts: boolean;
			manage_chatbot: boolean;
			manage_chatbot_flows: boolean;
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
		};
	}) {
		try {
			const { data } = await APIInstance.post(`/users/agents/${agentId}/permissions`, permission);
			return {
				id: data.id ?? '',
				name: data.name ?? '',
				email: data.email ?? '',
				phone: data.phone ?? '',
				permissions: {
					manage_media: data.permissions?.manage_media ?? false,
					manage_contacts: data.permissions?.manage_contacts ?? false,
					manage_chatbot: data.permissions?.manage_chatbot ?? false,
					manage_chatbot_flows: data.permissions?.manage_chatbot_flows ?? false,
					assigned_labels: data.permissions?.assigned_labels ?? [],
					view_broadcast_reports: data.permissions?.view_broadcast_reports ?? false,
					create_broadcast: data.permissions?.create_broadcast ?? false,
					create_phonebook: data.permissions?.create_phonebook ?? false,
					update_phonebook: data.permissions?.update_phonebook ?? false,
					delete_phonebook: data.permissions?.delete_phonebook ?? false,
					auto_assign_chats: data.permissions?.auto_assign_chats ?? false,
					create_template: data.permissions?.create_template ?? false,
					update_template: data.permissions?.update_template ?? false,
					delete_template: data.permissions?.delete_template ?? false,
					create_recurring_broadcast: data.permissions?.create_recurring_broadcast ?? false,
				},
			};
		} catch (err) {
			throw new Error('You are not authorized to update permissions');
		}
	}
}
