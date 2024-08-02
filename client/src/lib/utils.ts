import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getFileSize(size: number) {
	const fileSizeKB = size / 1024; // Convert bytes to kilobytes
	const fileSizeMB = fileSizeKB / 1024;
	const fileSizeGB = fileSizeMB / 1024;
	if (fileSizeGB > 1) {
		return `${fileSizeGB.toFixed(2)} GB`;
	}
	return fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`;
}

export function getFileType(mimeType: string) {
	if (mimeType.startsWith('image')) {
		return 'image';
	} else if (mimeType.startsWith('video')) {
		return 'video';
	} else if (mimeType.startsWith('audio')) {
		return 'audio';
	} else if (mimeType.startsWith('application/pdf')) {
		return 'PDF';
	}
	return 'file';
}

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
