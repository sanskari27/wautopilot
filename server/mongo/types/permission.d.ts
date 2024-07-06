import { Document, Types } from 'mongoose';

export default interface IPermission extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	assigned_labels: string[];
	view_broadcast_reports: boolean;
	create_broadcast: boolean;
	create_phonebook: boolean;
	update_phonebook: boolean;
	delete_phonebook: boolean;
	auto_assign_chats: boolean;
	create_template: boolean;
	update_template: boolean;
	delete_template: boolean;
}
