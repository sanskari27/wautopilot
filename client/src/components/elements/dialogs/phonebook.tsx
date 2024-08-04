'use client';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { mobileCheck } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

export default function PhonebookDialog() {
	const router = useRouter();
	const pathname = usePathname();

	const isMobile = mobileCheck();

	if (isMobile) {
		return (
			<Drawer
				open
				onOpenChange={(open) => {
					if (!open) {
						router.replace(pathname);
					}
				}}
			>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Contact Card</DrawerTitle>
					</DrawerHeader>
					<PhonebookForm />
				</DrawerContent>
			</Drawer>
		);
	} else {
		return (
			<Sheet
				open
				onOpenChange={(open) => {
					if (!open) {
						router.replace(pathname);
					}
				}}
			>
				<SheetContent className='w-screen sm:max-w-3xl'>
					<SheetHeader>
						<SheetTitle className='text-center'>Phonebook Record</SheetTitle>
					</SheetHeader>
					<PhonebookForm />
				</SheetContent>
			</Sheet>
		);
	}
}

export function PhonebookForm() {
	return <div className='min-h-[80vh]'>sad</div>;
}
