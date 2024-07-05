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
		const { data } = await APIInstance.post('/users/agents', agent);
		return {
			id: data.id ?? '',
			name: data.name ?? '',
			email: data.email ?? '',
			phone: data.phone ?? '',
		};
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
			//ignore
		}
	}
}
