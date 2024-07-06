import APIInstance from '../config/APIInstance';
import { Media } from '../store/types/MediaState';
export default class MediaService {
	static async getMedias(device_id: string) {
		try {
			const { data } = await APIInstance.get(`/${device_id}/media`);
			return data.list as Media[];
		} catch (err) {
			return [];
		}
	}

	static async deleteMedia(device_id: string, id: string) {
		await APIInstance.delete(`/${device_id}/media/${id}`);
	}

	static async downloadMedia(device_id: string, id: string) {
		try {
			const response = await APIInstance.get(`/${device_id}/media/${id}/download`, {
				responseType: 'blob',
			});
			const blob = new Blob([response.data]);

			const contentDisposition = response.headers['content-disposition'];
			const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
			const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

			// Create a temporary link element
			const downloadLink = document.createElement('a');
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = filename; // Specify the filename

			// Append the link to the body and trigger the download
			document.body.appendChild(downloadLink);
			downloadLink.click();

			// Clean up - remove the link
			document.body.removeChild(downloadLink);
		} catch (err) {
			//ignore
		}
	}

	static async uploadMedia(
		device_id: string,
		file: File,
		filename: string,
		onUploadProgress: (progress: number) => void
	) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('filename', filename);
		const { data } = await APIInstance.post(`/${device_id}/media`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent) => {
				onUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1)));
			},
		});
		return data.media;
	}
}
