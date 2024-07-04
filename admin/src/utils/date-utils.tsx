export const getMonth = (month: number, fullName = false) => {
	const MONTHS = {
		'1': 'January',
		'2': 'February',
		'3': 'March',
		'4': 'April',
		'5': 'May',
		'6': 'June',
		'7': 'July',
		'8': 'August',
		'9': 'September',
		'10': 'October',
		'11': 'November',
		'12': 'December',
	};
	if (month < 1 || month > 12) {
		return '';
	}
	const name = MONTHS[month.toString() as keyof typeof MONTHS];
	return fullName ? name! : name!.substring(0, 3);
};

export const getFormattedDate = (date: number) => {
	return date < 10 ? `0${date}` : date.toString();
};
