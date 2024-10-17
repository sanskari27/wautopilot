import mongoose from 'mongoose';
export {
	APIKeyDB,
	AccountDB,
	AgentLogDB,
	BroadcastDB,
	ButtonResponseDB,
	CartDB,
	ChatbotDB,
	ChatbotFlowDB,
	ContactDB,
	ConversationDB,
	ConversationMessageDB,
	CouponDB,
	FlowMessagesDB,
	MediaDB,
	PaymentDB,
	PermissionDB,
	PhoneBookDB,
	PlanDB,
	QuickReplyDB,
	RecurringBroadcastDB,
	ScheduledMessageDB,
	SessionDB,
	ShortenLinkDB,
	StorageDB,
	SubscriptionDB,
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
