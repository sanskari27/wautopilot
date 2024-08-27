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
import useBoolean from '@/hooks/useBoolean';

export default function DevicesAlertDialog() {
	const { value, on, off } = useBoolean(false);
	const { deviceAlert, setDeviceAlert } = useDeviceAlert();

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
					<Button>Add Device</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return null;
}
