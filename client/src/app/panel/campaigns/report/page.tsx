import BroadcastService from '@/services/broadcast.service';
import ReportDataTable from './data-table';

export default async function Report() {
	const list = await BroadcastService.broadcastReport();

	// await BroadcastService.deleteBroadcast(selected_device_id, campaign);

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<ReportDataTable list={list} />
		</div>
	);
}
