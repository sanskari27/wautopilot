'use client';
import Each from '@/components/containers/each';
import { useAdmins, useAdminSearch } from '@/components/context/admin';
import { SearchBar } from '@/components/elements/searchbar';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { AdminContextMenu } from './_components/contextMenu';
import { ExtendExpiryDialog, MarkupPriceDialog, UpgradePlanDialog } from './_components/dialogs';

export default function AdminPage() {
	const list = useAdmins();
	const setAdminSearch = useAdminSearch();

	return (
		<div className='flex flex-col gap-2 justify-center p-4'>
			<div className='flex justify-between items-end'>
				<h1 className='text-2xl font-bold'>Admins</h1>
				<div className='flex items-center rounded-lg p-2 w-[450px]'>
					<SearchBar
						onChange={setAdminSearch}
						onSubmit={setAdminSearch}
						placeholders={['Search by name', 'Search by email', 'Search by phone']}
					/>
				</div>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableCaption>{list.length} Admins Found.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className=''>Name</TableHead>
							<TableHead className='w-[35%]'>Email</TableHead>
							<TableHead className='text-right'>Phone</TableHead>
							<TableHead>Subscription Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={list}
							render={(admin) => (
								<AdminContextMenu id={admin.id} admin={admin}>
									<TableRow className='cursor-context-menu'>
										<TableCell className='font-medium'>{admin.name}</TableCell>
										<TableCell className='w-[40%]'>
											<a href={`mailto:${admin.email}`}>{admin.email}</a>
										</TableCell>
										<TableCell className='text-right'>
											<a href={`tel:${admin.phone}`}>+{admin.phone}</a>
										</TableCell>
										<TableCell>{admin.isSubscribed ? 'Subscribed' : 'Not Subscribed'}</TableCell>
									</TableRow>
								</AdminContextMenu>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			<ExtendExpiryDialog />
			<MarkupPriceDialog />
			<UpgradePlanDialog />
		</div>
	);
}
