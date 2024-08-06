'use client';
import Show from '@/components/containers/show';
import { useMedia } from '@/components/context/media';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { UploadMedia } from './_components/dialogs';
import { PreviewGrid } from './_components/preview-grid';

export default function Media() {
	const medias = useMedia();
	const router = useRouter();
	const searchParams = useSearchParams();
	const preview = searchParams.get('preview') === 'true';

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Media</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<div className='flex items-center space-x-2'>
						<Label htmlFor='toggle-preview'>Enable Preview</Label>
						<Switch
							id='toggle-preview'
							checked={preview}
							onCheckedChange={(checked) => {
								const url = new URL((window as any).location);
								url.searchParams.set('preview', checked.toString());
								router.replace(url.toString());
							}}
						/>
					</div>
					<Show.ShowIf condition>
						<UploadMedia />
					</Show.ShowIf>
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
