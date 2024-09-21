import BroadcastService from '@/services/broadcast.service';
import { notFound } from 'next/navigation';
import ResponseDataTable from './data-table';

export default async function ChatbotButtonReport({
	params,
}: {
	params: {
		campaignId: string;
	};
}) {
	if (!params) return notFound();
	if (!params.campaignId) return <div>Invalid broadcast id</div>;

	const list = await BroadcastService.buttonResponseReport({
		campaignId: params.campaignId,
		exportCSV: false,
	});

	if (!list) return notFound();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<ResponseDataTable id={params.campaignId} list={list ?? []} />
		</div>
	);
}
