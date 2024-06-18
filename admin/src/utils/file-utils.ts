export function getFileSize(size: number) {
	const fileSizeKB = size / 1024; // Convert bytes to kilobytes
	const fileSizeMB = fileSizeKB / 1024;
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
