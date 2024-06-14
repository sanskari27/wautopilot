export function getFileSize(size: number) {
	const fileSizeKB = size / 1024; // Convert bytes to kilobytes
	const fileSizeMB = fileSizeKB / 1024;
	return fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`;
}
