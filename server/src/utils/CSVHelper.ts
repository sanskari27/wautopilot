import { Parser } from 'json2csv';
export default class CSVHelper {
	static exportPhonebook(records: { [key: string]: string }[]) {
		const allKeys = [...new Set(records.flatMap((record) => Object.keys(record)))];
		const keysWithoutLabel = allKeys.filter((key) => key !== 'labels' && key !== 'salutation');
		const keysWithTags = [
			{
				value: 'salutation',
				label: 'prefix',
			},
			...keysWithoutLabel.map((key) => ({
				value: key,
				label: key,
			})),
			{
				value: 'labels',
				label: 'Tags',
			},
		];

		// Create the parser with the values (unique keys)
		const json2csvParser = new Parser({ fields: keysWithTags });
		const csv = json2csvParser.parse(records);

		return csv;
	}

	static exportBroadcastReport(
		records: {
			to: string;
			status: string;
			sendAt: string;
			text: string;
			template_name: string;
			sent_at: string;
			read_at: string;
			delivered_at: string;
			failed_at: string;
			failed_reason: string;
		}[]
	): string {
		const keys = [
			{
				value: 'to',
				label: 'Recipient',
			},
			{
				value: 'status',
				label: 'Status',
			},
			{
				value: 'sent_at',
				label: 'Sent At',
			},
			{
				value: 'read_at',
				label: 'Read At',
			},
			{
				value: 'delivered_at',
				label: 'Delivered At',
			},
			{
				value: 'failed_at',
				label: 'Failed At',
			},
			{
				value: 'failed_reason',
				label: 'Failed Reason',
			},
			{
				value: 'template_name',
				label: 'Template Name',
			},
			{
				value: 'text',
				label: 'Body',
			},
			{
				value: 'description',
				label: 'Description',
			},
		];

		const json2csvParser = new Parser({
			header: true,
			fields: keys,
		});
		const csv = json2csvParser.parse(records);

		return csv;
	}

	static exportChatbotReport(
		records: {
			trigger: string;
			recipient: string;
			triggered_at: string;
			message_type: 'TEXT' | 'MEDIA' | 'CONTACT' | 'LOCATION' | 'UNKNOWN';
			text: string;
		}[]
	): string {
		const keys = [
			{
				value: 'recipient',
				label: 'Recipient',
			},
			{
				value: 'trigger',
				label: 'Trigger',
			},
			{
				value: 'message_type',
				label: 'Respond Type',
			},
			{
				value: 'text',
				label: 'Body',
			},
			{
				value: 'triggered_at',
				label: 'Triggered At',
			},
		];

		const json2csvParser = new Parser({
			header: true,
			fields: keys,
		});
		const csv = json2csvParser.parse(records);

		return csv;
	}

	static exportButtonResponseReport(
		records: {
			button_id: string;
			button_text: string;
			recipient: string;
			responseAt: string;
			name: string;
			email: string;
		}[]
	): string {
		const keys = [
			{
				value: 'name',
				label: 'Name',
			},
			{
				value: 'email',
				label: 'Email',
			},
			{
				value: 'recipient',
				label: 'Phone Number',
			},
			{
				value: 'button_text',
				label: 'Button Text',
			},
			{
				value: 'responseAt',
				label: 'Response At',
			},
		];

		const json2csvParser = new Parser({
			header: true,
			fields: keys,
		});
		const csv = json2csvParser.parse(records);

		return csv;
	}
}
