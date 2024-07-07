import mongoose from 'mongoose';
import IPermission from '../types/permission';
import { AccountDB_name } from './Account';

export const PermissionDB_name = ' Permission';

const schema = new mongoose.Schema<IPermission>({
	linked_to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
	},
	auto_assign_chats: {
		type: Boolean,
		default: false,
	},
	assigned_labels: {
		type: [String],
		default: [],
	},

	phonebook: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		delete: {
			type: Boolean,
			default: false,
		},
		export: {
			type: Boolean,
			default: false,
		},
	},
	chatbot: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		delete: {
			type: Boolean,
			default: false,
		},
		export: {
			type: Boolean,
			default: false,
		},
	},
	chatbot_flow: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		delete: {
			type: Boolean,
			default: false,
		},
		export: {
			type: Boolean,
			default: false,
		},
	},
	broadcast: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		report: {
			type: Boolean,
			default: false,
		},
		export: {
			type: Boolean,
			default: false,
		},
	},
	recurring: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		delete: {
			type: Boolean,
			default: false,
		},
		export: {
			type: Boolean,
			default: false,
		},
	},
	media: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		delete: {
			type: Boolean,
			default: false,
		},
	},
	contacts: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		delete: {
			type: Boolean,
			default: false,
		},
	},
	template: {
		create: {
			type: Boolean,
			default: false,
		},
		update: {
			type: Boolean,
			default: false,
		},
		delete: {
			type: Boolean,
			default: false,
		},
	},
	buttons: {
		read: {
			type: Boolean,
			default: false,
		},
		export: {
			type: Boolean,
			default: false,
		},
	},
});

schema.index({ email: 1 }, { unique: true });

const PermissionDB = mongoose.model<IPermission>(PermissionDB_name, schema);

export default PermissionDB;
