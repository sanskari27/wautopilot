import { Types } from 'mongoose';
import { AgentLogDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import DateUtils from '../utils/DateUtils';
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

	async getLogs() {
		const logs = await AgentLogDB.find({ linked_to: this.userId });
		return logs.map((log) => ({
			_id: log._id,
			agent_id: log.agent_id,
			agent_name: log.agent_name,
			text: log.text,
			data: log.data as object,
			createdAt: DateUtils.getMoment(log.createdAt).format('YYYY-MM-DD HH:mm:ss'),
		}));
	}
}
