import { Types } from 'mongoose';
import { ContactDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IContact from '../../mongo/types/contact';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import UserService from './user';

function processContactDocs(docs: IContact[]) {
	return docs.map((doc) => ({
		id: doc._id.toString(),
		formatted_name: doc.name.formatted_name ?? '',
		addresses: doc.addresses ?? [],
		birthday: doc.birthday ?? '',
		emails: doc.emails ?? [],
		phones: doc.phones ?? [],
		urls: doc.urls ?? [],
		name: {
			formatted_name: doc.name.formatted_name ?? '',
			first_name: doc.name.first_name ?? '',
			last_name: doc.name.last_name ?? '',
			middle_name: doc.name.middle_name ?? '',
			suffix: doc.name.suffix ?? '',
			prefix: doc.name.prefix ?? '',
		},
		org: {
			company: doc.org.company ?? '',
			department: doc.org.department ?? '',
			title: doc.org.title ?? '',
		},
	}));
}

export default class ContactService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public async addContact(contact: Partial<IContact>) {
		const docs = await ContactDB.create({
			...contact,
			linked_to: this.userId,
		});

		return processContactDocs([docs])[0];
	}

	public async fetchContacts(
		{
			page,
			limit,
		}: {
			page: number;
			limit: number;
		} = {
			page: 1,
			limit: 2000000,
		}
	) {
		const records = await ContactDB.find({
			linked_to: this.userId,
		})
			.skip((page - 1) * limit)
			.limit(limit);
		return processContactDocs(records);
	}

	public async totalRecords(labels: string[] = []): Promise<number> {
		const records = await ContactDB.count({
			linked_to: this.userId,
			...(labels.length > 0 ? { labels: { $in: labels } } : {}),
		});
		return records;
	}

	public async updateContact(recordId: Types.ObjectId, details: Partial<IContact>) {
		const record = await ContactDB.findOne({ _id: recordId, linked_to: this.userId });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await ContactDB.updateOne({ _id: recordId }, details);

		return processContactDocs([
			{
				_id: recordId,
				...details,
			} as IContact,
		])[0];
	}

	public async deleteContacts(recordId: Types.ObjectId[]) {
		await ContactDB.deleteMany({ _id: { $in: recordId }, linked_to: this.userId });
	}
}
