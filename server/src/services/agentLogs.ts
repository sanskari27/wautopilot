import { Types } from 'mongoose';
import { AgentLogDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import UserService from './user';

export default class AgentLogService extends UserService {
	private _agent_id: Types.ObjectId;
	private _agent_name: string;
	public constructor(account: IAccount, agent: IAccount) {
		super(account);
		this._agent_id = agent._id;
		this._agent_name = agent.name;
	}

	async addLog(details: { text?: string; data?: object }) {
		const { text, data } = details;

		const log = new AgentLogDB({
			agent_id: this._agent_id,
			agent_name: this._agent_name,
			linked_to: this.userId,
			text,
			data,
		});
		await log.save();
		return log;
	}
}
