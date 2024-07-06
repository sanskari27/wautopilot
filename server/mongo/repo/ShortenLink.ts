import mongoose, { Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import { SHORT_LINK_REDIRECT } from '../../src/config/const';
import QRUtils from '../../src/utils/QRUtils';
import IShortenLink from '../types/shortenLink';
import { AccountDB_name } from './Account';

export const ShortenLinkDB_name = 'ShortenLink';

const schema = new mongoose.Schema<IShortenLink>({
	linked_to: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},
	key: {
		type: String,
		unique: true,
	},
	title: String,
	link: String,
	qrString: String,
});

schema.pre('save', async function (next) {
	if (!this.key) {
		this.key = nanoid(6);
	}
	if (!this.qrString) {
		const qrCodeBuffer = await QRUtils.generateQR(`${SHORT_LINK_REDIRECT}${this.key}`, true);
		if (qrCodeBuffer) {
			this.qrString = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;
		}
	}
	next();
});

const ShortenLinkDB = mongoose.model<IShortenLink>(ShortenLinkDB_name, schema);

export default ShortenLinkDB;
