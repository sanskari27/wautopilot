import mongoose from 'mongoose';
import ITask from '../types/task';
import { AccountDB_name } from './Account';

export const TaskDB_name = 'Task';

const schema = new mongoose.Schema<ITask>(
	{
		linked_to: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: AccountDB_name,
		},
		message: {
			type: String,
			required: true,
		},
		hidden: {
			type: Boolean,
			required: false,
		},
		due_date: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
	}
);

const TaskDB = mongoose.model<ITask>(TaskDB_name, schema);

export default TaskDB;
