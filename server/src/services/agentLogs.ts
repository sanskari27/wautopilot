import { Types } from 'mongoose';
import { AgentLogDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import UserService from './user';

export default class AgentLogService extends UserService {
	private _agent_id: Types.ObjectId;
	public constructor(account: IAccount, agent_id: Types.ObjectId) {
		super(account);
		this._agent_id = agent_id;
	}

	async addLog(details: { text?: string; data?: object }) {
		const { text, data } = details;
		const log = new AgentLogDB({
			agent_id: this._agent_id,
			linked_to: this.userId,
			text,
			data,
		});
		await log.save();
		return log;
	}
}
