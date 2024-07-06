export function countOccurrences(inputString: string) {
	const regex = /\{\{\d+\}\}/g;

	const matches = inputString.match(regex);

	return matches ? matches.length : 0;
}

export function randomString(length: number = 6) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	for (let i = length; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}
