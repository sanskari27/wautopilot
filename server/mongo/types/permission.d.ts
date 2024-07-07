import { Document, Types } from 'mongoose';

export default interface IPermission extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	assigned_labels: string[];
	auto_assign_chats: boolean;
	phonebook: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	chatbot: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	chatbot_flow: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	broadcast: {
		create: boolean;
		update: boolean;
		report: boolean;
		export: boolean;
	};
	recurring: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	media: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	contacts: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	template: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	buttons: {
		read: boolean;
		export: boolean;
	};
}
