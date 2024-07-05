import { Types } from 'mongoose';
import { WhatsappLinkDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsappLink';
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
	private _device: IWhatsappLink;
	public constructor(account: IAccount, device: IWhatsappLink) {
		super(account);
		this._device = device;
	}

	get accessToken() {
		return this._device.accessToken;
	}

	get phoneNumberId() {
		return this._device.phoneNumberId;
	}

	get waid() {
		return this._device.waid;
	}

	get deviceId() {
		return this._device._id;
	}

	get device() {
		return this._device;
	}

	public static async addRecord(user: Types.ObjectId, details: RecordWithAccessToken) {
		let phoneNumber: string | null = null;
		let verifiedName: string | null = null;
		try {
			const {
				data: { data },
			} = await MetaAPI(details.accessToken).get(`/${details.waid}/phone_numbers`);

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
			linked_to: user,
		});

		return processPhonebookDocs([doc])[0];
	}

	public static async fetchRecords(user: Types.ObjectId): Promise<
		(Record & {
			id: string;
		})[]
	> {
		const records = await WhatsappLinkDB.find({ linked_to: user });
		return processPhonebookDocs(records);
	}

	public static async deleteRecord(user: Types.ObjectId, recordId: Types.ObjectId) {
		const record = await WhatsappLinkDB.findOne({ _id: recordId, linked_to: user });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await WhatsappLinkDB.deleteOne({ _id: recordId });
	}

	public static async fetchDeviceDoc(recordId: Types.ObjectId, user: Types.ObjectId) {
		const record = await WhatsappLinkDB.findOne({ _id: recordId, linked_to: user });

		if (!record) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return record;
	}

	public async fetchMessageHealth() {
		try {
			const {
				data: { data },
			} = await MetaAPI(this.accessToken).get(`/${this.waid}/phone_numbers`);

			if (!data) {
				return 'RED';
			}

			const phoneNumberDoc = data.find(
				(phone: { id: string; display_phone_number: string; verified_name: string }) =>
					phone.id === this.phoneNumberId
			);

			if (!phoneNumberDoc) {
				return 'RED';
			}

			return phoneNumberDoc.quality_rating.toUpperCase() as 'GREEN' | 'YELLOW' | 'RED';
		} catch (err) {
			return 'RED';
		}
	}
}
