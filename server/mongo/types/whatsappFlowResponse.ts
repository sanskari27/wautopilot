import { Document, Schema, Types } from 'mongoose';

export default interface IWhatsappFlowResponse extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	recipient: string;
	received_at: Date;
	message_id: string;
	context: {
		from: string;
		id: string;
	};
	data: Schema.Types.Mixed;
}
