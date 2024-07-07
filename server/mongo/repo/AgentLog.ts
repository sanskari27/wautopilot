import mongoose from 'mongoose';
import IAgentLog from '../types/agentLog';
import { AccountDB_name } from './Account';

export const AgentLogDB_name = 'AgentLog';

const schema = new mongoose.Schema<IAgentLog>(
	{
		linked_to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		agent_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		agent_name: String,
		text: String,
		data: { type: mongoose.Schema.Types.Mixed, default: {} },
	},
	{
		timestamps: { createdAt: true },
	}
);

const AgentLogDB = mongoose.model<IAgentLog>(AgentLogDB_name, schema);

export default AgentLogDB;
