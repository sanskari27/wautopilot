import { Types } from 'mongoose';
import { WhatsappLinkDB } from '../../mongo/repo';
import IAccount from '../../mongo/types/account';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import UserService from './user';

type Record = {
	phoneNumberId: string;
	waid: string;
};

type RecordWithAccessToken = Record & {
	accessToken: string;
};

function processPhonebookDocs(
	docs: (Record & {
		_id: Types.ObjectId;
	})[]
): (Record & {
	id: string;
})[] {
	return docs.map((doc) => ({
		id: doc._id.toString(),
		phoneNumberId: doc.phoneNumberId,
		waid: doc.waid,
	}));
}

export default class WhatsappLinkService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public async addRecord(details: RecordWithAccessToken) {
		const doc = await WhatsappLinkDB.create({
			...details,
			linked_to: this.userId,
		});

		return processPhonebookDocs([doc])[0];
	}

	public async fetchRecords(): Promise<
		(Record & {
			id: string;
		})[]
	> {
		const records = await WhatsappLinkDB.find({ linked_to: this.userId });
		return processPhonebookDocs(records);
	}

	public async deleteRecord(recordId: Types.ObjectId) {
		const record = await WhatsappLinkDB.findOne({ _id: recordId, linked_to: this.userId });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await WhatsappLinkDB.deleteOne({ _id: recordId });
	}

	public async fetchDeviceDoc(recordId: Types.ObjectId) {
		const record = await WhatsappLinkDB.findOne({ _id: recordId, linked_to: this.userId });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return record;
	}
}
