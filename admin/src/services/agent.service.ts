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
					permissions: agent.permissions ?? {},
				};
			});
		} catch (err) {
			//ignore
			return [];
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
		await APIInstance.post(`/${device_id}/conversation/${conversationId}/assign-agent/${agentId}`);
	}

	static async assignConversationsToAgent(
		device_id: string,
		agentId: string,
		details: {
			phonebook_ids?: string[];
			numbers?: string[];
		}
	) {
		await APIInstance.post(`/${device_id}/conversation/assign-agent/${agentId}`, details);
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
					buttons: {
						read: data.permissions?.buttons?.read ?? false,
						export: data.permissions?.buttons?.export ?? false,
					},
					auto_assign_chats: data.permissions?.auto_assign_chats ?? false,
					assigned_labels: data.permissions?.assigned_labels ?? [],
				},
			};
		} catch (err) {
			throw new Error('You are not authorized to update permissions');
		}
	}

	static async getAgentLogs(agentId: string) {
		try {
			const { data } = await APIInstance.get(`/users/agents/${agentId}/logs`);
			return data.logs as {
				agent_name: string;
				text: string;
				data: object;
				createdAt: string;
			}[];
		} catch (err) {
			return [];
		}
	}

	static async transferConversationsToAgent({
		deviceId,
		agentId,
		agentTo,
	}: {
		deviceId: string;
		agentId: string;
		agentTo: string;
	}) {
		await APIInstance.post(`/${deviceId}/conversation/transfer-agent/${agentId}/${agentTo}`);
	}

	static async hideAssignedTask(id: string) {
		try {
			const { data } = await APIInstance.patch(`/users/tasks/${id}`);
			return data.tasks as {
				id: string;
				hidden: boolean;
				message: string;
				due_date: string;
			}[];
		} catch (err) {
			return [];
		}
	}

	static async getAssignedTasks(
		id: string,
		params: {
			date_from?: string;
			date_to?: string;
		}
	) {
		try {
			const path = id !== 'me' ? `/users/agents/${id}/tasks` : `/users/tasks`;
			const { data } = await APIInstance.get(path, {
				params: {
					...(params.date_from && { date_from: params.date_from }),
					...(params.date_to && { date_to: params.date_to }),
				},
			});
			return data.tasks as {
				id: string;
				hidden: boolean;
				message: string;
				due_date: string;
			}[];
		} catch (err) {
			return [];
		}
	}

	static async assignTask(message: string, due_date: string, assign_to?: string) {
		try {
			const { data } = await APIInstance.post('/users/tasks', { message, assign_to, due_date });
			return data.task as {
				id: string;
				hidden: boolean;
				due_date: string;
				message: string;
			}[];
		} catch (err) {
			return [];
		}
	}
}
