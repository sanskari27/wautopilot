import Show from '@/components/containers/show';
import { Label } from '@/components/ui/label';
import MediaService from '@/services/media.service';
import { SwitchPreview, UploadButton } from './_components/buttons';
import { DataTable } from './_components/data-table';
import { PreviewGrid } from './_components/preview-grid';

export default async function Media({
	searchParams,
}: {
	searchParams: {
		preview: string;
	};
}) {
	const medias = await MediaService.getMedias();
	const preview = searchParams.preview === 'true';

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Media</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<div className='flex items-center space-x-2'>
						<Label htmlFor='toggle-preview'>Enable Preview</Label>
						<SwitchPreview />
					</div>
					<UploadButton />
				</div>
			</div>

			<Show>
				<Show.When condition={preview}>
					<PreviewGrid records={medias} />
				</Show.When>
				<Show.Else>
					<DataTable records={medias} />
				</Show.Else>
			</Show>
		</div>
	);
}
