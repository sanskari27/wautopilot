import { FilterQuery, Types } from 'mongoose';
import { PhoneBookDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IPhoneBook from '../../mongo/types/phonebook';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import UserService from './user';

type IPhonebookRecord = {
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
): (IPhonebookRecord & {
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
		others: (filterUndefinedKeys(doc.others as object) ?? {}) as IPhonebookRecord['others'],
		labels: doc.labels ?? [],
	}));
}

export default class PhoneBookService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public async addRecords(details: Partial<IPhonebookRecord>[]) {
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
								salutation: record.salutation ?? existingRecord.salutation,
								first_name: record.first_name ?? existingRecord.first_name,
								last_name: record.last_name ?? existingRecord.last_name,
								middle_name: record.middle_name ?? existingRecord.middle_name,
								email: record.email ?? existingRecord.email,
								birthday: record.birthday ?? existingRecord.birthday,
								anniversary: record.anniversary ?? existingRecord.anniversary,
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
			search = {},
		}: {
			page: number;
			limit: number;
			labels: string[];
			search?: {
				[key: string]: string;
			};
		} = {
			page: 1,
			limit: 2000000,
			labels: [],
			search: {},
		}
	) {
		const query = await this.buildQuery({ labels, search });
		const records = await PhoneBookDB.find(query)
			.sort({ createdAt: -1, _id: 1 })
			.skip((page - 1) * limit)
			.limit(limit);
		return processPhonebookDocs(records);
	}

	public async totalRecords(
		labels: string[] = [],
		search: {
			[key: string]: string;
		} = {}
	): Promise<number> {
		const query = await this.buildQuery({ labels, search });
		const records = await PhoneBookDB.count(query);
		return records;
	}

	async buildQuery({
		labels = [],
		search = {},
	}: {
		labels: string[];
		search: {
			[key: string]: string;
		};
	}) {
		const q = {
			$or: [] as FilterQuery<IPhoneBook>[],
			$and: [] as FilterQuery<IPhoneBook>[],
		};

		if (search.all) {
			const records = await PhoneBookDB.find({ linked_to: this.userId });

			const fields = records.reduce<Set<string>>((acc, record) => {
				Object.keys(record.others).forEach((field) => acc.add(field));
				return acc;
			}, new Set<string>());

			const otherKeys = Array.from(fields);
			q.$or.push(
				...[
					{ first_name: { $regex: search.all, $options: 'i' } },
					{ phone_number: { $regex: search.all, $options: 'i' } },
					{ email: { $regex: search.all, $options: 'i' } },
					{ salutation: { $regex: search.all, $options: 'i' } },
					{ last_name: { $regex: search.all, $options: 'i' } },
					{ middle_name: { $regex: search.all, $options: 'i' } },
					{ birthday: { $regex: search.all, $options: 'i' } },
					{ anniversary: { $regex: search.all, $options: 'i' } },
					...otherKeys.map((k) => ({
						[`others.${k}`]: { $regex: search.all, $options: 'i' },
					})),
				]
			);
		}

		Object.keys(search).forEach((key) => {
			if (key == 'all') {
				return;
			}
			if (
				[
					'salutation',
					'first_name',
					'last_name',
					'middle_name',
					'phone_number',
					'email',
					'birthday',
					'anniversary',
				].includes(key)
			) {
				q.$and.push({ [key]: { $regex: search[key], $options: 'i' } });
			} else {
				q.$and.push({ [`others.${key}`]: { $regex: search[key], $options: 'i' } });
			}
		});

		const $and = [...q.$and, ...(q.$or.length > 0 ? [{ $or: q.$or }] : [])];

		return {
			linked_to: this.userId,
			...(labels.length > 0 ? { labels: { $in: labels } } : {}),
			...(q.$or.length > 0 || q.$and.length > 0 ? { $and } : {}),
		};
	}

	public async updateRecord(recordId: Types.ObjectId, details: Partial<IPhonebookRecord>) {
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

	public async setLabelsByPhone(numbers: string[], tags: string[]) {
		await PhoneBookDB.updateMany({ phone_number: { $in: numbers } }, { labels: tags });
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

	public async getFields() {
		const records = await PhoneBookDB.find({ linked_to: this.userId });

		const fields = records.reduce<Set<string>>((acc, record) => {
			Object.keys(record.others).forEach((field) => acc.add(field));
			return acc;
		}, new Set<string>());

		const list = Array.from(fields).map((field) => ({ value: field, label: field }));

		list.push(
			...[
				{
					value: 'all',
					label: 'All',
				},
				{
					value: 'salutation',
					label: 'Salutation',
				},
				{
					value: 'first_name',
					label: 'First Name',
				},
				{
					value: 'last_name',
					label: 'Last Name',
				},
				{
					value: 'middle_name',
					label: 'Middle Name',
				},
				{
					value: 'phone_number',
					label: 'Phone Number',
				},
				{
					value: 'email',
					label: 'Email',
				},
				{
					value: 'birthday',
					label: 'Birthday',
				},
				{
					value: 'anniversary',
					label: 'Anniversary',
				},
			]
		);

		list.sort((a, b) => a.label.localeCompare(b.label));

		return list;
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

	public async addFields({ name, defaultValue }: { name: string; defaultValue: string }) {
		const key = `others.${name}`;
		await PhoneBookDB.updateMany(
			{
				linked_to: this.userId,
				[key]: { $exists: false },
			},
			{
				$set: {
					[key]: defaultValue,
				},
			}
		);
	}
}
