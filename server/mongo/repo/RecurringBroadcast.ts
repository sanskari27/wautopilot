import mongoose from 'mongoose';
import { BROADCAST_STATUS } from '../../src/config/const';
import IRecurringBroadcast from '../types/recurringBroadcast';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const RecurringBroadcastDB_name = 'RecurringBroadcast';

const schema = new mongoose.Schema<IRecurringBroadcast>(
	{
		linked_to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		device_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: WhatsappLinkDB_name,
			required: true,
		},

		name: {
			type: String,
			required: true,
			default: () => `RecurringBroadcast @ ${new Date().toISOString().split('T')[0]}`,
		},
		description: String,
		wish_from: String,
		status: {
			type: String,
			enum: Object.keys(BROADCAST_STATUS),
			default: BROADCAST_STATUS.ACTIVE,
		},
		labels: {
			type: [String],
			default: [],
		},

		template_id: String,
		template_name: String,

		startTime: String,
		endTime: String,
		delay: Number,
		template_header: {
			type: {
				type: String,
				enum: ['IMAGE', 'TEXT', 'VIDEO', 'DOCUMENT'],
			},
			media_id: String,
			link: String,
			text: [
				{
					custom_text: String,
					phonebook_data: String,
					variable_from: {
						type: String,
						enum: ['custom_text', 'phonebook_data'],
					},
					fallback_value: String,
				},
			],
		},
		template_body: [
			{
				custom_text: String,
				phonebook_data: String,
				variable_from: {
					type: String,
					enum: ['custom_text', 'phonebook_data'],
				},
				fallback_value: String,
			},
		],

		template_buttons: [[String]],
		template_carousel: {
			cards: [
				{
					header: {
						media_id: String,
					},
					body: [
						{
							custom_text: String,
							phonebook_data: String,
							variable_from: {
								type: String,
								enum: ['custom_text', 'phonebook_data'],
							},
							fallback_value: String,
						},
					],
					buttons: [[String]],
				},
			],
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const RecurringBroadcastDB = mongoose.model<IRecurringBroadcast>(RecurringBroadcastDB_name, schema);

export default RecurringBroadcastDB;
