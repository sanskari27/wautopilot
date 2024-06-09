import APIInstance from '../config/APIInstance';

export default class DeviceService {
	static async listDevices() {
		try {
			const { data } = await APIInstance.get(`whatsapp-link/linked-devices`);

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

	static async addDevice(details: { phoneNumberId: string; waid: string; accessToken: string }) {
		try {
			await APIInstance.post(`whatsapp-link/link-device`, {
				phoneNumberId: details.phoneNumberId,
				waid: details.waid,
				accessToken: details.accessToken,
			});

			return true;
		} catch (err) {
			return false;
		}
	}

	static async removeDevice(id: string) {
		try {
			await APIInstance.post(`whatsapp-link/remove-device/${id}`);
			return true;
		} catch (err) {
			return false;
		}
	}
}
