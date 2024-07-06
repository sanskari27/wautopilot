import { Document, Types } from 'mongoose';

export default interface IShortenLink extends Document {
	linked_to: Types.ObjectId;
	title: string;
	key: string;
	link: string;
	qrString: string;
}
