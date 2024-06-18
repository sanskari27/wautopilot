export function countOccurrences(inputString: string) {
	const regex = /\{\{\d+\}\}/g;

	const matches = inputString.match(regex);

	return matches ? matches.length : 0;
}
