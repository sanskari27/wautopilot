import api from '@/lib/api';

export default class UploadService {
	static async generateMetaHandle(file: File) {
		const form = new FormData();
		form.append('file', file);
		const { data } = await api.post(`/uploads/upload-meta-handle`, form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data.file as string;
	}
	static async generateMetaMediaId(file: File, onUploadProgress?: (progress: number) => void) {
		const form = new FormData();
		form.append('file', file);
		const { data } = await api.post(`/uploads/upload-meta-media`, form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent) => {
				if (onUploadProgress) {
					onUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1)));
				}
			},
		});

		return data.media_id as string;
	}

	static async downloadMetaMedia(media_id: string) {
		try {
			const response = await api.get(`/uploads/download-meta-media/${media_id}`, {
				responseType: 'blob',
			});
			const data = response.data;
			const extension = response.headers['content-type']?.split('/')[1];
			const filename = 'download.' + extension ?? 'file';
			const url = window.URL.createObjectURL(new Blob([data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();
		} catch (err) {
			//ignore
		}
	}
}
