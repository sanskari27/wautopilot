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

	static async createAgent(agent: { name: string; email: string; phone: string }) {
		try {
			const { data } = await APIInstance.post('/users/agents', agent);
			return data;
		} catch (err) {
			//ignore
		}
	}

	static async updateAgent(agent: { id: string; name: string; email: string; phone: string }) {
		try {
			const { data } = await APIInstance.post(`/users/agents/${agent.id}`, agent);
			return data;
		} catch (err) {
			//ignore
		}
	}
}
