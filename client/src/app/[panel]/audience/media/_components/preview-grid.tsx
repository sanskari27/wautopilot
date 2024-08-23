'use client';
import Each from '@/components/containers/each';
import PreviewFile from '@/components/elements/preview-file';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import { SERVER_URL } from '@/lib/consts';
import { Media } from '@/types/media';
import { useEffect, useState } from 'react';
import { DeleteButton, DownloadButton } from './buttons';

export function PreviewGrid({ records }: { records: Media[] }) {
	return (
		<div className='w-full'>
			<div className='rounded-md grid grid-cols-6 gap-3'>
				<Each items={records} render={(record) => <PreviewElement media={record} />} />
			</div>
		</div>
	);
}

function PreviewElement({ media }: { media: Media }) {
	const [data, setData] = useState<{
		blob: Blob | MediaSource | null;
		url: string | null;
		type: string;
		size: string;
		filename: string;
	} | null>(null);

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		api
			.get(`${SERVER_URL}media/${media.id}/download`, {
				responseType: 'blob',
				onDownloadProgress: (progressEvent) => {
					if (progressEvent.total) {
						setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
					} else {
						setProgress(-1);
					}
				},
			})
			.then((response) => {
				const contentDisposition = response.headers['content-disposition'];
				const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
				const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

				const { data: blob } = response;
				const url = window.URL.createObjectURL(blob);
				const fileType = blob.type as string;
				const fileSizeBytes = blob.size as number;
				let type = '';

				if (fileType.includes('image')) {
					type = 'image';
				} else if (fileType.includes('video')) {
					type = 'video';
				} else if (fileType.includes('pdf')) {
					type = 'PDF';
				} else if (fileType.includes('audio')) {
					type = fileType;
				}

				const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
				const fileSizeMB = fileSizeKB / 1024;
				setData({
					blob,
					url,
					type,
					size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
					filename,
				});
			});
	}, [media]);

	return (
		<Card>
			<CardContent className='py-2 px-2 aspect-square'>
				<PreviewFile
					data={data?.url ? { url: data.url, type: data.type } : null}
					progress={progress}
				/>
			</CardContent>
			<Separator className='bg-gray-300' />
			<CardFooter className='p-3'>
				<div className='flex flex-col items-stretch w-full text-xs'>
					<div className='flex gap-2 items-center'>
						<p className='line-clamp-1'>
							Name:
							<span className='font-medium ml-2'>{media.filename}</span>
						</p>
					</div>
					<div className='flex gap-2 items-center'>
						<p>File Type:</p>
						<p className='font-medium'>{data?.type}</p>
					</div>
					<div className='flex gap-2 items-center'>
						<p>File Size:</p>

						<p className='font-medium'>{data?.size}</p>
					</div>
					<div className='flex justify-end gap-2 mt-2'>
						<DownloadButton id={media.id} />
						<DeleteButton id={media.id} />
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
