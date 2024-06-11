import APIInstance from '../config/APIInstance';

export default class UploadService {
	static async generateMetaHandle(device_id: string, file: File) {
		const form = new FormData();
		form.append('file', file);
		const { data } = await APIInstance.post(`/uploads/${device_id}/upload-meta-handle`, form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data.file as string;
	}
	static async generateMetaMediaID(device_id: string, file: File) {
		const form = new FormData();
		form.append('file', file);
		const { data } = await APIInstance.post(`/uploads/${device_id}/upload-meta-media`, form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data.media_id as string;
	}
}
