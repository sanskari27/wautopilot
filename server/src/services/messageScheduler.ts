import { Types } from 'mongoose';
import { ScheduledMessageDB } from '../../mongo';
import { BroadcastDB_name } from '../../mongo/repo/Broadcast';
import { ChatBotFlowDB_name } from '../../mongo/repo/ChatbotFlow';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { MESSAGE_STATUS } from '../config/const';
import { Message } from '../models/message';
import DateUtils from '../utils/DateUtils';
import { FormattedMessage } from '../utils/MessageHelper';
import BroadcastService from './broadcast';
import ChatBotService from './chatbot';
import ConversationService from './conversation';
import MessageSender from './messageSender';
import UserService from './user';

export default class MessageScheduler {
	private user_id: Types.ObjectId;
	private device: Types.ObjectId;

	constructor(user_id: Types.ObjectId, device: Types.ObjectId) {
		this.device = device;
		this.user_id = user_id;
	}

	async scheduleMessage(
		message: Message,
		opts: {
			sendAt: Date;
			scheduler_id: Types.ObjectId;
			scheduler_type: string;
			formattedMessage: FormattedMessage;
		}
	) {
		const msg = await ScheduledMessageDB.create({
			linked_to: this.user_id,
			device_id: this.device,
			scheduler_id: opts.scheduler_id,
			scheduler_type: opts.scheduler_type,
			status: MESSAGE_STATUS.PENDING,
			to: message.getRecipient(),
			sendAt: opts.sendAt,
			messageObject: message.toObject(),
			formattedMessage: opts.formattedMessage,
		});
		return msg._id;
	}

	async cancelScheduledMessage(scheduler_id: Types.ObjectId) {
		await ScheduledMessageDB.deleteMany({
			linked_to: this.user_id,
			scheduler_id,
		});
	}

	private static async getPendingMessages() {
		return ScheduledMessageDB.find({
			status: MESSAGE_STATUS.PENDING,
			sendAt: { $lte: new Date() },
		}).populate<{
			device_id: IWhatsappLink;
			linked_to: IAccount;
		}>('device_id linked_to');
	}

	private static async markMessagesAsProcessing(message_ids: Types.ObjectId[]) {
		await ScheduledMessageDB.updateMany(
			{ _id: { $in: message_ids } },
			{
				$set: {
					status: MESSAGE_STATUS.PROCESSING,
				},
			}
		);
	}

	static async sendScheduledMessages() {
		const messages = await this.getPendingMessages();

		const message_ids = messages.map((msg) => msg._id);
		await this.markMessagesAsProcessing(message_ids);

		messages.forEach(async (msg) => {
			const conversationService = new ConversationService(msg.linked_to, msg.device_id);
			const userService = new UserService(msg.linked_to);
			const messageSender = new MessageSender(msg.device_id);

			const recipient = await conversationService.createConversation(msg.to);

			let failed_at: Date | undefined = undefined;
			let failed_reason: string | undefined = undefined;
			let status = MESSAGE_STATUS.PROCESSING;
			let message_id: string | undefined = undefined;

			if (userService.walletBalance < userService.markupPrice) {
				failed_at = DateUtils.getMomentNow().toDate();
				failed_reason = 'Insufficient balance';
				status = MESSAGE_STATUS.FAILED;
			} else {
				const sendingResult = await messageSender.sendMessageObject(msg.messageObject);
				if (sendingResult.success) {
					message_id = sendingResult.message_id;
					userService.deductCredit(1);
				} else {
					failed_at = DateUtils.getMomentNow().toDate();
					failed_reason = sendingResult.failed_reason;
					status = MESSAGE_STATUS.FAILED;
				}
			}

			const addedMessage = await conversationService.addMessageToConversation(recipient, {
				recipient: msg.to,
				message_id: message_id,
				scheduled_by: {
					id: msg.scheduler_id,
					name: msg.scheduler_type,
				},
				failed_at,
				failed_reason,
				status,
				...msg.formattedMessage,
				...(msg.messageObject.context
					? { context: { id: msg.messageObject.context.message_id } }
					: {}),
				message_type: msg.message_type,
			});

			if (addedMessage && msg.scheduler_type === BroadcastDB_name) {
				BroadcastService.updateBroadcastMessageId(msg.scheduler_id, {
					prev_id: msg._id,
					new_id: addedMessage._id,
				});
			}
			if (addedMessage && msg.scheduler_type === ChatBotFlowDB_name) {
				ChatBotService.updateMessageId(msg.scheduler_id, {
					prev_id: msg._id,
					new_id: addedMessage._id,
					meta_message_id: message_id,
				});
			}
			if (status !== MESSAGE_STATUS.FAILED) {
				msg.remove();
			} else {
				msg.failed_at = failed_at || DateUtils.getMomentNow().toDate();
				msg.failed_reason = failed_reason || 'Unknown error';
				msg.status = MESSAGE_STATUS.FAILED;
				msg.save();
			}
		});
	}

	public async deleteNurturingByFlow(bot_id: Types.ObjectId) {
		return ScheduledMessageDB.deleteMany({
			linked_to: this.user_id,
			device_id: this.device,
			scheduler_id: bot_id,
			scheduler_type: 'ChatbotFlow Nurturing',
		});
	}

	public async pendingTodayCount() {
		const start = DateUtils.getMomentNow().startOf('day').toDate();
		const end = DateUtils.getMomentNow().endOf('day').toDate();

		return ScheduledMessageDB.countDocuments({
			linked_to: this.user_id,
			device_id: this.device,
			sendAt: { $gte: start, $lte: end },
			status: MESSAGE_STATUS.PENDING,
		});
	}
}
