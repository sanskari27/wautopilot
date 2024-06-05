import { Document, Types } from 'mongoose';

export default interface IWhatsappLink extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	phoneNumberId: string;
	waid: string;
	accessToken: string;
}
