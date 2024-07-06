import mongoose from 'mongoose';
import IPermission from '../types/permission';
import { AccountDB_name } from './Account';

export const PermissionDB_name = ' Permission';

const schema = new mongoose.Schema<IPermission>({
	linked_to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
	},

	assigned_broadcast_labels: {
		type: [String],
		default: [],
	},
	view_broadcast_reports: {
		type: Boolean,
		default: false,
	},
	assigned_phonebook_labels: {
		type: [String],
		default: [],
	},
	create_phonebook: {
		type: Boolean,
		default: false,
	},
	update_phonebook: {
		type: Boolean,
		default: false,
	},
	delete_phonebook: {
		type: Boolean,
		default: false,
	},
	auto_assign_chats: {
		type: Boolean,
		default: false,
	},
	create_template: {
		type: Boolean,
		default: false,
	},
	update_template: {
		type: Boolean,
		default: false,
	},
	delete_template: {
		type: Boolean,
		default: false,
	},
});

schema.index({ email: 1 }, { unique: true });

const PermissionDB = mongoose.model<IPermission>(PermissionDB_name, schema);

export default PermissionDB;
