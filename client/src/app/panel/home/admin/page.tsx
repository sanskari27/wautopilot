import Each from '@/components/containers/each';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import AdminsService from '@/services/admin.service';
import { AdminContextMenu } from './_components/contextMenu';
import { ExtendExpiryDialog, MarkupPriceDialog, UpgradePlanDialog } from './_components/dialogs';

export default async function AdminPage() {
	const list = await AdminsService.listAdmins()!;

	return (
		<div className='flex flex-col gap-2 justify-center p-4'>
			<div className='flex justify-between'>
				<h1 className='text-2xl font-bold'>Admins</h1>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableCaption>{list.length} Agents Found.</TableCaption>
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
