import { Types } from 'mongoose';
import TaskDB from '../../mongo/repo/Task';
import IAccount from '../../mongo/types/account';
import ITask from '../../mongo/types/task';
import DateUtils from '../utils/DateUtils';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import UserService from './user';

function processDocs(docs: ITask[]) {
	return docs.map((doc) => ({
		id: doc._id,
		message: doc.message,
		// in 12 hour format
		due_date: DateUtils.getMoment(doc.due_date).format('MMM Do @ hh:mm a'),
		hidden: doc.hidden ?? false,
	}));
}

export default class TaskService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	async addTask(details: { message: string; due_date?: string }) {
		const task = await TaskDB.create({
			linked_to: this.account._id,
			message: details.message,
			due_date: details.due_date,
		});
		return processDocs([task])[0];
	}

	async hideTask(id: Types.ObjectId) {
		await TaskDB.updateOne(
			{
				_id: id,
				linked_to: this.userId,
			},
			{
				hidden: true,
			}
		);
	}

	async listTasks(query: { date_from?: string; date_to?: string }) {
		query = filterUndefinedKeys(query ?? {});

		const tasks = await TaskDB.find({
			linked_to: this.userId,
			due_date: {
				$gte: query.date_from
					? DateUtils.getMoment(query.date_from).toDate()
					: DateUtils.getMomentNow().add(-1, 'year').toDate(),
				$lte: query.date_to
					? DateUtils.getMoment(query.date_to).toDate()
					: DateUtils.getMomentNow().toDate(),
			},
		}).sort({ due_date: 1, createdAt: 1 });
		return processDocs(tasks);
	}

	async transferTask(id: Types.ObjectId, to: Types.ObjectId) {
		await TaskDB.updateOne(
			{
				_id: id,
				linked_to: this.userId,
			},
			{
				linked_to: to,
			}
		);
	}
}
