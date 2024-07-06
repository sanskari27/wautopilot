import { Document, Types } from 'mongoose';

export default interface IPermission extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	assigned_broadcast_labels: string[];
	view_broadcast_reports: boolean;
	assigned_phonebook_labels: string[];
	create_phonebook: boolean;
	update_phonebook: boolean;
	delete_phonebook: boolean;
	auto_assign_chats: boolean;
	create_template: boolean;
	update_template: boolean;
	delete_template: boolean;
}
