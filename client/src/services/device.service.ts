import api from '@/lib/api';

export default class DeviceService {
	static async listDevices() {
		try {
			const { data } = await api.get(`/whatsapp-link/linked-devices`);

			const devices = data.devices as {
				id: string;
				phoneNumberId: string;
				waid: string;
				phoneNumber: string;
				verifiedName: string;
			}[];

			return {
				devices,
				currentDevice: data.currentDevice as string,
			};
		} catch (err) {
			return {
				devices: [],
				currentDevice: '',
			};
		}
	}

	static async addDevice(details: {
		phoneNumberId: string;
		waid: string;
		accessToken: string;
		code: string;
	}) {
		try {
			await api.post(`/whatsapp-link/link-device`, {
				phoneNumberId: details.phoneNumberId,
				waid: details.waid,
				accessToken: details.accessToken,
				code: details.code,
			});

			return true;
		} catch (err) {
			return false;
		}
	}

	static async removeDevice(id: string) {
		await api.post(`/whatsapp-link/remove-device/${id}`);
	}

	static async fetchMessageHealth(id: string) {
		try {
			const { data } = await api.get(`/whatsapp-link/message-health/${id}`);
			return data.health as 'RED' | 'YELLOW' | 'GREEN';
		} catch (err) {
			return 'RED';
		}
	}
	static async setCurrentDevice(id: string) {
		await api.get(`/whatsapp-link/current-device/${id}`);
	}
}
