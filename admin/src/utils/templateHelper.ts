export function countOccurrences(inputString: string) {
	const regex = /\{\{\d+\}\}/g;

	const matches = inputString.match(regex);

	return matches ? matches.length : 0;
}

export function convertToId(text: string) {
	return text.replace(/\s/g, '-').toLowerCase();
}
