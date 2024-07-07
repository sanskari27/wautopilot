/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';
import { AgentPermission } from '../store/types/Agent';

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
		permission: AgentPermission;
	}) {
		try {
			const { data } = await APIInstance.post(`/users/agents/${agentId}/permissions`, permission);
			return {
				id: data.id ?? '',
				name: data.name ?? '',
				email: data.email ?? '',
				phone: data.phone ?? '',
				permissions: {
					broadcast: {
						create: data.permissions?.broadcast?.create ?? false,
						update: data.permissions?.broadcast?.update ?? false,
						report: data.permissions?.broadcast?.report ?? false,
						export: data.permissions?.broadcast?.export ?? false,
					},
					recurring: {
						create: data.permissions?.recurring?.create ?? false,
						update: data.permissions?.recurring?.update ?? false,
						delete: data.permissions?.recurring?.delete ?? false,
						export: data.permissions?.recurring?.export ?? false,
					},
					media: {
						create: data.permissions?.media?.create ?? false,
						update: data.permissions?.media?.update ?? false,
						delete: data.permissions?.media?.delete ?? false,
					},
					phonebook: {
						create: data.permissions?.phonebook?.create ?? false,
						update: data.permissions?.phonebook?.update ?? false,
						delete: data.permissions?.phonebook?.delete ?? false,
						export: data.permissions?.phonebook?.export ?? false,
					},
					chatbot: {
						create: data.permissions?.chatbot?.create ?? false,
						update: data.permissions?.chatbot?.update ?? false,
						delete: data.permissions?.chatbot?.delete ?? false,
						export: data.permissions?.chatbot?.export ?? false,
					},
					chatbot_flow: {
						create: data.permissions?.chatbot_flow?.create ?? false,
						update: data.permissions?.chatbot_flow?.update ?? false,
						delete: data.permissions?.chatbot_flow?.delete ?? false,
						export: data.permissions?.chatbot_flow?.export ?? false,
					},
					contacts: {
						create: data.permissions?.contacts?.create ?? false,
						update: data.permissions?.contacts?.update ?? false,
						delete: data.permissions?.contacts?.delete ?? false,
					},
					template: {
						create: data.permissions?.template?.create ?? false,
						update: data.permissions?.template?.update ?? false,
						delete: data.permissions?.template?.delete ?? false,
					},
					auto_assign_chats: data.permissions?.auto_assign_chats ?? false,
					assigned_labels: data.permissions?.assigned_labels ?? [],
				},
			};
		} catch (err) {
			throw new Error('You are not authorized to update permissions');
		}
	}
}
