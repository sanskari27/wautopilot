import mongoose, { Schema } from 'mongoose';
import IWhatsappLink from '../types/whatsapplink';
import { AccountDB_name } from './Account';

export const WhatsappLinkDB_name = 'WhatsappLink';

const schema = new mongoose.Schema<IWhatsappLink>({
	linked_to: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},
	phoneNumberId: {
		type: String,
	},
	waid: {
		type: String,
	},
	accessToken: {
		type: String,
	},
});

schema.index({ linked_to: 1, phoneNumberId: 1, waid: 1 }, { unique: true });

const WhatsappLinkDB = mongoose.model<IWhatsappLink>(WhatsappLinkDB_name, schema);

export default WhatsappLinkDB;
