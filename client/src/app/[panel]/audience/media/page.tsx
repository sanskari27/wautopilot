'use client';
import Show from '@/components/containers/show';
import { useMedia } from '@/components/context/media';
import { DataTable } from './(components)/data-table';
import { UploadMedia } from './(components)/dialogs';

export default function Media() {
	const medias = useMedia();
	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Media</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Show.ShowIf condition>
						<UploadMedia />
					</Show.ShowIf>
				</div>
			</div>

			<DataTable records={medias} />
		</div>
	);
}
