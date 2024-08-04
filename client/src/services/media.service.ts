import api from '@/lib/api';
import { Media } from '@/types/media';

export default class MediaService {
	static async getMedias() {
		try {
			const { data } = await api.get(`/media`);
			return data.list as Media[];
		} catch (err) {
			return [];
		}
	}

	static async deleteMedia(id: string) {
		await api.delete(`/media/${id}`);
	}

	static async downloadMedia(id: string) {
		const response = await api.get(`/media/${id}/download`, {
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
	}

	static async uploadMedia(
		file: File,
		filename: string,
		onUploadProgress?: (progress: number) => void
	) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('filename', filename);
		const { data } = await api.post(`/media`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent) => {
				onUploadProgress?.(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1)));
			},
		});
		return data.media;
	}
}
