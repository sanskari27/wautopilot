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
