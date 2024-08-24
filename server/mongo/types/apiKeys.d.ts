import { Document, Types } from 'mongoose';

export default interface IAPIKey extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	name: string;
	token: string;
	permissions: {
		messages: {
			create: boolean;
		};
	};
	createdAt: Date;

	generateToken(): string;
}
