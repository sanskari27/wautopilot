import mongoose from 'mongoose';
export {
	APIKeyDB,
	AccountDB,
	AgentLogDB,
	BroadcastDB,
	ButtonResponseDB,
	ChatbotDB,
	ChatbotFlowDB,
	ContactDB,
	ConversationDB,
	ConversationMessageDB,
	CouponDB,
	FlowMessagesDB,
	MediaDB,
	PermissionDB,
	PhoneBookDB,
	PlanDB,
	QuickReplyDB,
	RecurringBroadcastDB,
	ScheduledMessageDB,
	SessionDB,
	ShortenLinkDB,
	StorageDB,
	SubscriptionDetailsDB,
	WalletTransactionDB,
	WebhookDB,
	WhatsappFlowResponseDB,
	WhatsappLinkDB,
} from './repo';

export default function connectDB(database_url: string) {
	return new Promise((resolve, reject) => {
		mongoose.set('strict', false);
		mongoose.set('strictQuery', false);
		mongoose.set('strictPopulate', false);
		mongoose
			.connect(database_url)
			.then(() => {
				resolve('Successfully connected to database');
			})
			.catch((error) => {
				reject(error);
			});
	});
}
