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

export const formatPhoneNumber = (phoneNumber: string) => {
	//mark first 4 digit last 2 digits visible others should be X
	const visibleFirst = phoneNumber.substring(0, 4);
	const visibleLast = phoneNumber.substring(phoneNumber.length - 4);
	const hidden = phoneNumber.substring(4, phoneNumber.length - 4).replace(/\d/g, 'X');
	return `${visibleFirst}${hidden}${visibleLast}`;
};
