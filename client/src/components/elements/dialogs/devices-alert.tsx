'use client';

import { useDeviceAlert } from '@/components/context/device-alert';
import { useDevicesDialogState } from '@/components/context/devicesState';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog';

export default function DevicesAlertDialog() {
	const { deviceAlert, setDeviceAlert } = useDeviceAlert();
	const { setDevices } = useDevicesDialogState();

	function openDevices() {
		setDeviceAlert(false);
		setDevices(true);
	}

	return (
		<Dialog
			open={deviceAlert}
			onOpenChange={(value) => {
				if (!value) {
					setDeviceAlert(false);
				}
			}}
		>
			<DialogContent>
				<DialogTitle>Alert</DialogTitle>
				<DialogDescription>
					No device is added, please add device to use all the features.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'destructive'}>Close</Button>
					</DialogClose>
					<Button onClick={openDevices}>Add Device</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return null;
}
