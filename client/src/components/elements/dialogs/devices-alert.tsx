'use client';

import { useDeviceAlert } from '@/components/context/device-alert';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function DevicesAlertDialog() {
	const { deviceAlert, setDeviceAlert } = useDeviceAlert();
	const router = useRouter();

	function openDevices() {
		setDeviceAlert(false);
		const url = new URL((window as any).location);
		if (!url.searchParams.has(`devices`)) {
			url.searchParams.set(`devices`, 'true');
		}
		router.replace(url.toString());
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
