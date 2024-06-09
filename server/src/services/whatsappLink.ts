import { Types } from 'mongoose';
import { WhatsappLinkDB } from '../../mongo/repo';
import IAccount from '../../mongo/types/account';
import MetaAPI from '../config/MetaAPI';
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
		phoneNumber: string;
		verifiedName: string;
	})[]
): (Record & {
	id: string;
	phoneNumber: string;
	verifiedName: string;
})[] {
	return docs.map((doc) => ({
		id: doc._id.toString(),
		phoneNumber: doc.phoneNumber,
		verifiedName: doc.verifiedName,
		phoneNumberId: doc.phoneNumberId,
		waid: doc.waid,
	}));
}

export default class WhatsappLinkService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public async addRecord(details: RecordWithAccessToken) {
		let phoneNumber: string | null = null;
		let verifiedName: string | null = null;
		try {
			const {
				data: { data },
			} = await MetaAPI.get(`/${details.waid}/phone_numbers`, {
				headers: {
					Authorization: `Bearer ${details.accessToken}`,
				},
			});

			if (!data) {
				return null;
			}

			const phoneNumberDoc = data.find(
				(phone: { id: string; display_phone_number: string; verified_name: string }) =>
					phone.id === details.phoneNumberId
			);

			if (!phoneNumberDoc) {
				return null;
			}

			phoneNumber = phoneNumberDoc.display_phone_number;
			verifiedName = phoneNumberDoc.verified_name;
		} catch (err) {
			return null;
		}

		const doc = await WhatsappLinkDB.create({
			...details,
			phoneNumber: phoneNumber,
			verifiedName: verifiedName,
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
