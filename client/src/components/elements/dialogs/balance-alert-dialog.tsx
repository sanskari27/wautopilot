'use client';

import { useBalanceAlert } from '@/components/context/balance-alert';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog';

export default function BalanceAlertDialog() {
	const { deviceAlert, setBalanceAlert } = useBalanceAlert();
	return (
		<Dialog
			open={deviceAlert}
			onOpenChange={(value) => {
				if (!value) {
					setBalanceAlert(false);
				}
			}}
		>
			<DialogContent>
				<DialogTitle>Alert</DialogTitle>
				<DialogDescription>Your wallet balance is less than 100.</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'destructive'}>Close</Button>
					</DialogClose>
					<Button onClick={() => setBalanceAlert(false)}>Okay</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return null;
}
