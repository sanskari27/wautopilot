import APIInstance from '../config/APIInstance';

export default class DeviceService {
	static async listDevices() {
		try {
			const { data } = await APIInstance.get(`/whatsapp-link/linked-devices`);

			const devices = data.devices as {
				id: string;
				phoneNumberId: string;
				waid: string;
				phoneNumber: string;
				verifiedName: string;
			}[];

			return devices;
		} catch (err) {
			return [];
		}
	}

	static async addDevice(details: {
		phoneNumberId: string;
		waid: string;
		accessToken: string;
		code: string;
	}) {
		try {
			await APIInstance.post(`/whatsapp-link/link-device`, {
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
		try {
			await APIInstance.post(`/whatsapp-link/remove-device/${id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async fetchMessageHealth(id: string) {
		try {
			const { data } = await APIInstance.get(`/whatsapp-link/message-health/${id}`);
			return data.health as 'RED' | 'YELLOW' | 'GREEN';
		} catch (err) {
			return 'RED';
		}
	}
}
