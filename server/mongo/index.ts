import mongoose from 'mongoose';
export {
	AccountDB,
	BroadcastDB,
	ContactDB,
	ConversationDB,
	ConversationMessageDB,
	MediaDB,
	PhoneBookDB,
	PlanDB,
	ScheduledMessageDB,
	SessionDB,
	StorageDB,
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
