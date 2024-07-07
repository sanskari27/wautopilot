import { Types } from 'mongoose';
import { PhoneBookDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IPhoneBook from '../../mongo/types/phonebook';
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

	labels: string[];
};

function processPhonebookDocs(
	docs: (Partial<IPhoneBook> & {
		_id: Types.ObjectId;
	})[]
): (Record & {
	id: Types.ObjectId;
})[] {
	return docs.map((doc) => ({
		id: doc._id,
		salutation: doc.salutation ?? '',
		first_name: doc.first_name ?? '',
		last_name: doc.last_name ?? '',
		middle_name: doc.middle_name ?? '',
		phone_number: doc.phone_number ?? '',
		email: doc.email ?? '',
		birthday: doc.birthday ?? '',
		anniversary: doc.anniversary ?? '',
		others: doc.others ?? {},
		labels: doc.labels ?? [],
	}));
}

export default class PhoneBookService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public async addRecords(details: Partial<Record>[]) {
		const phoneNumbers = details.map((record) => record.phone_number);
		const existingRecords = await PhoneBookDB.find({
			phone_number: { $in: phoneNumbers },
			linked_to: this.userId,
		});

		// Step 2: Create a map of existing records by phone number
		const existingRecordsMap = new Map(
			existingRecords.map((record) => [record.phone_number, record])
		);

		const updateOperations = [];
		const insertRecords = [];

		for (const record of details) {
			const existingRecord = record.phone_number
				? existingRecordsMap.get(record.phone_number)
				: null;

			if (existingRecord) {
				updateOperations.push({
					updateOne: {
						filter: { _id: existingRecord._id },
						update: {
							$set: {
								phone_number: record.phone_number?.replace(/\D/g, '') ?? '',
								others: { ...existingRecord.others, ...record.others },
							},
							$addToSet: { labels: { $each: record.labels ?? [] } },
						},
					},
				});
			} else {
				insertRecords.push({
					...record,
					phone_number: record.phone_number?.replace(/\D/g, '') ?? '',
					linked_to: this.userId,
				});
			}
		}

		if (updateOperations.length > 0) {
			await PhoneBookDB.bulkWrite(updateOperations as any[]);
		}

		if (insertRecords.length > 0) {
			await PhoneBookDB.insertMany(insertRecords);
		}
	}

	public async fetchRecords(
		{
			page,
			limit,
			labels,
		}: {
			page: number;
			limit: number;
			labels: string[];
		} = {
			page: 1,
			limit: 2000000,
			labels: [],
		}
	) {
		const records = await PhoneBookDB.find({
			linked_to: this.userId,
			...(labels.length > 0 ? { labels: { $in: labels } } : {}),
		})
			.sort({ createdAt: -1, _id: 1 })
			.skip((page - 1) * limit)
			.limit(limit);
		return processPhonebookDocs(records);
	}

	public async totalRecords(labels: string[] = []): Promise<number> {
		const records = await PhoneBookDB.count({
			linked_to: this.userId,
			...(labels.length > 0 ? { labels: { $in: labels } } : {}),
		});
		return records;
	}

	public async updateRecord(recordId: Types.ObjectId, details: Partial<Record>) {
		const record = await PhoneBookDB.findOne({ _id: recordId, linked_to: this.userId });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await PhoneBookDB.updateOne({ _id: recordId }, details);

		return processPhonebookDocs([{ _id: recordId, ...details }])[0];
	}

	public async deleteRecord(recordId: Types.ObjectId[]) {
		await PhoneBookDB.deleteMany({ _id: { $in: recordId } });
	}

	public async setLabels(recordId: Types.ObjectId[], tags: string[]) {
		await PhoneBookDB.updateMany({ _id: { $in: recordId } }, { labels: tags });
	}

	public async addLabels(recordId: Types.ObjectId[], tags: string[]) {
		await PhoneBookDB.updateMany(
			{ _id: { $in: recordId } },
			{ $push: { labels: { $each: tags } } }
		);
	}

	public async removeLabels(recordId: Types.ObjectId[], tags: string[]) {
		await PhoneBookDB.updateMany({ _id: { $in: recordId } }, { $pull: { labels: { $in: tags } } });
	}

	public async getAllLabels() {
		const records = await PhoneBookDB.find({ linked_to: this.userId });

		const labels = records.reduce<Set<string>>((acc, record) => {
			record.labels.forEach((label) => acc.add(label));
			return acc;
		}, new Set<string>());

		return Array.from(labels);
	}

	public async findRecordByPhone(phone: string) {
		const record = await PhoneBookDB.findOne({
			phone_number: phone,
			linked_to: this.userId,
		});

		if (!record) {
			return null;
		}

		return processPhonebookDocs([record])[0];
	}

	public async findRecordsByPhone(phones: string[]) {
		const records = await PhoneBookDB.find({
			phone_number: { $in: phones },
			linked_to: this.userId,
		});

		return processPhonebookDocs(records);
	}

	public async findRecordsByIds(ids: Types.ObjectId[]) {
		const records = await PhoneBookDB.find({
			_id: { $in: ids },
			linked_to: this.userId,
		});

		return processPhonebookDocs(records);
	}
}
