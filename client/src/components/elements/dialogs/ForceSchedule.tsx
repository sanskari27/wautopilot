import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ForceScheduleDialog({
	children,
	onConfirm,
}: {
	children: React.ReactNode;
	onConfirm: (forceSchedule: boolean) => void;
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Do you want to force schedule?</AlertDialogTitle>
					<AlertDialogDescription>
						This campaign may contains some unsubscribed contacts. Do you want to force schedule
						this campaign?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className='bg-yellow-500 text-white hover:bg-yellow-500/90'
						onClick={() => onConfirm(false)}
					>
						Ignore unsubscribed
					</AlertDialogAction>
					<AlertDialogAction
						className='bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={() => onConfirm(true)}
					>
						Send to all
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
