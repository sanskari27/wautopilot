import { Types } from 'mongoose';
import PhoneBookDB from '../../mongo/repo/PhoneBook';
import IAccount from '../../mongo/types/account';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import UserService from './user';

type Record = {
	salutation: string;
	first_name: string;
	last_name: string;
	middle_name: string;
	phone_number: string;
	email: string;
	birthday: string;
	anniversary: string;

	others: {
		[others: string]: string;
	};
};

function processPhonebookDocs(
	docs: (Partial<Record> & {
		_id: Types.ObjectId;
	})[]
): (Record & {
	id: string;
})[] {
	return docs.map((doc) => ({
		id: doc._id.toString(),
		salutation: doc.salutation ?? '',
		first_name: doc.first_name ?? '',
		last_name: doc.last_name ?? '',
		middle_name: doc.middle_name ?? '',
		phone_number: doc.phone_number ?? '',
		email: doc.email ?? '',
		birthday: doc.birthday ?? '',
		anniversary: doc.anniversary ?? '',
		others: doc.others ?? {},
	}));
}

export default class PhoneBookService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public async addRecords(details: Partial<Record>[]) {
		const docs = await Promise.all(
			details.map(async (record) => {
				const doc = await PhoneBookDB.create({
					...record,
					linked_to: this.userId,
				});

				return {
					_id: doc._id,
					...record,
				};
			})
		);

		return processPhonebookDocs(docs);
	}

	public async fetchRecords(): Promise<
		(Record & {
			id: string;
		})[]
	> {
		const records = await PhoneBookDB.find({ linked_to: this.userId });
		return processPhonebookDocs(records);
	}

	public async updateRecord(recordId: Types.ObjectId, details: Partial<Record>) {
		const record = await PhoneBookDB.findOne({ _id: recordId, linked_to: this.userId });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await PhoneBookDB.updateOne({ _id: recordId }, details);

		return processPhonebookDocs([{ _id: recordId, ...details }])[0];
	}

	public async deleteRecord(recordId: Types.ObjectId) {
		const record = await PhoneBookDB.findOne({ _id: recordId, linked_to: this.userId });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await PhoneBookDB.deleteOne({ _id: recordId });
	}

	public async setLabels(recordId: Types.ObjectId, tags: string[]) {
		const record = await PhoneBookDB.findOne({ _id: recordId, linked_to: this.userId });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await PhoneBookDB.updateOne({ _id: recordId }, { labels: tags });
	}

	public async getAllLabels() {
		const records = await PhoneBookDB.find({ linked_to: this.userId });

		const labels = records.reduce<Set<string>>((acc, record) => {
			record.labels.forEach((label) => acc.add(label));
			return acc;
		}, new Set<string>());

		return Array.from(labels);
	}
}
