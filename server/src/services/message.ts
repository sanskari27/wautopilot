import BroadcastMessageDB from '../../mongo/repo/BroadcastMessage';
import IAccount from '../../mongo/types/account';
import { MESSAGE_STATUS } from '../config/const';
import WhatsappLinkService from './whatsappLink';

export default class MessageService extends WhatsappLinkService {
	public constructor(account: IAccount) {
		super(account);
	}

	public static async markSent(message_id: string) {
		await BroadcastMessageDB.updateOne({ _id: message_id }, { status: MESSAGE_STATUS.SENT });
	}

	public static async markDelivered(message_id: string) {
		await BroadcastMessageDB.updateOne({ _id: message_id }, { status: MESSAGE_STATUS.DELIVERED });
	}

	public static async markRead(message_id: string) {
		await BroadcastMessageDB.updateOne({ _id: message_id }, { status: MESSAGE_STATUS.READ });
	}
}
