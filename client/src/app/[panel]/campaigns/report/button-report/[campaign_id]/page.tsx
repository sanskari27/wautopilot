import BroadcastService from '@/services/broadcast.service';
import { notFound } from 'next/navigation';
import ResponseDataTable from './data-table';

export default async function Report({
	params,
}: {
	params: {
		campaign_id: string;
	};
}) {
	if (!params) return notFound();
	if (!params.campaign_id) return <div>Invalid campaign id</div>;

	const list = await BroadcastService.buttonResponseReport({
		campaignId: params.campaign_id,
		exportCSV: false,
	});

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<ResponseDataTable id={params.campaign_id} list={list ?? []} />
		</div>
	);
}
