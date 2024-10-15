import axios from 'axios';
import { MESSAGE_STATUS } from '../config/const';
import MetaAPI from '../config/MetaAPI';
import { Message } from '../models/message';
import DateUtils from '../utils/DateUtils';

type WhatsappDevice = {
	accessToken: string;
	waid: string;
	phoneNumberId: string;
};

export default class MessageSender {
	private device: WhatsappDevice;

	constructor(device: WhatsappDevice) {
		this.device = device;
	}

	async sendMessage(message: Message) {
		const object = message.toObject();

		return this.sendMessageObject(object);
	}

	async sendMessageObject(object: Object) {
		try {
			const { data } = await MetaAPI(this.device.accessToken).post(
				`${this.device.phoneNumberId}/messages`,
				object
			);

			return {
				success: true,
				status: MESSAGE_STATUS.SENT,
				message_id: data.messages[0].id,
				sent_at: DateUtils.getMomentNow().toDate(),
			};
		} catch (err) {
			let failed_reason: string;
			if (axios.isAxiosError(err)) {
				failed_reason = JSON.stringify(err.response?.data ?? '') as string;
			} else {
				failed_reason = (err as any).message as string;
			}

			return {
				success: false,
				status: MESSAGE_STATUS.FAILED,
				failed_reason,
				failed_at: DateUtils.getMomentNow().toDate(),
			};
		}
	}
}
