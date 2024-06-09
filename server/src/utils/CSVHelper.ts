import { Parser } from 'json2csv';
export default class CSVHelper {
	static exportPhonebook(records: { [key: string]: string }[]) {
		const allKeys = [...new Set(records.flatMap((record) => Object.keys(record)))];

		// Create the parser with the fields (unique keys)
		const json2csvParser = new Parser({ fields: allKeys });
		const csv = json2csvParser.parse(records);

		return csv;
	}
}
