import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useMedia } from '@/components/context/media';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchBar } from '@/components/ui/searchbar';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';
import { SERVER_URL } from '@/lib/consts';
import { cn } from '@/lib/utils';
import { Media } from '@/types/media';
import React, { useEffect, useState } from 'react';
import PreviewFile from '../preview-file';

export default function MediaSelectorDialog({
	children,
	singleSelect = false,
	selectedValue,
	onConfirm,
	returnType = 'id',
	type = 'all',
}: {
	children: React.ReactNode;
	selectedValue?: string[];
	singleSelect?: boolean;
	onConfirm: (media: string[]) => void;
	returnType?: 'id' | 'media_id';
	type?: 'all' | 'image' | 'video' | 'audio' | 'document';
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const list = useMedia();

	const [searchText, setSearchText] = useState('');
	const records = list.filter((record) =>
		`${record.filename} ${record.mime_type}`.toLowerCase().includes(searchText.toLowerCase())
	);

	const [previewMode, setPreviewMode] = React.useState(false);
	const [selectedMedia, setSelectedMedia] = React.useState<string[]>(selectedValue || []);

	const handleAddMedia = (media: Media) => {
		const mediaId = returnType === 'id' ? media.id : media.media_id;
		if (singleSelect) {
			setSelectedMedia([mediaId]);
		} else {
			setSelectedMedia([...selectedMedia, mediaId]);
		}
	};

	const handleRemoveMedia = (media: Media) => {
		const mediaId = returnType === 'id' ? media.id : media.media_id;
		setSelectedMedia(selectedMedia.filter((id) => id !== mediaId));
	};

	const isSelected = (media: Media) =>
		selectedMedia.includes(returnType === 'id' ? media.id : media.media_id);

	const handleSave = () => {
		onConfirm(selectedMedia);
		buttonRef.current?.click();
		setSelectedMedia([]);
	};

	const mediaList = list.filter((media) => {
		if (type === 'all' || type === 'document') return true;
		if (type === 'image') return media.mime_type.includes('image');
		if (type === 'video') return media.mime_type.includes('video');
		if (type === 'audio') return media.mime_type.includes('audio');
		return false;
	});

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-xl lg:max-w-3xl'>
				<DialogHeader>
					<DialogTitle className='flex justify-between'>Select Media</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<div className='flex'>
						<SearchBar
							size='sm'
							onChange={setSearchText}
							onSubmit={setSearchText}
							placeholders={['Search by name', 'Search by type']}
						/>
						<span className='flex items-center gap-2 justify-end'>
							Preview{' '}
							<Switch
								checked={previewMode}
								onCheckedChange={(checked) => setPreviewMode(checked)}
							/>
						</span>
					</div>
				</DialogDescription>
				<ScrollArea className='gap-4 h-[400px]'>
					<Show>
						<Show.When condition={!previewMode}>
							<Table>
								<TableHeader>
									<TableRow>
										<TableCell>S.No.</TableCell>
										<TableCell>File Name</TableCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									<Each
										items={records}
										render={(media) => (
											<TableRow>
												<TableCell>
													<Checkbox
														checked={isSelected(media)}
														onCheckedChange={(checked) => {
															if (checked) {
																handleAddMedia(media);
															} else {
																handleRemoveMedia(media);
															}
														}}
													/>
												</TableCell>
												<TableCell>{media.filename}</TableCell>
											</TableRow>
										)}
									/>
								</TableBody>
							</Table>
						</Show.When>
						<Show.Else>
							<div className='grid grid-cols-2 gap-3'>
								<Each
									items={mediaList}
									render={(media) => (
										<PreviewElement
											isSelected={isSelected(media)}
											onSelected={handleAddMedia}
											onRemove={handleRemoveMedia}
											media={media}
										/>
									)}
								/>
							</div>
						</Show.Else>
					</Show>
				</ScrollArea>
				<DialogFooter>
					<Button
						type='submit'
						className='bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={handleSave}
					>
						Select
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function PreviewElement({
	media,
	isSelected,
	onSelected,
	onRemove,
}: {
	media: Media;
	isSelected?: boolean;
	onSelected?: (media: Media) => void;
	onRemove?: (media: Media) => void;
}) {
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
		<>
			<div
				className={cn(
					'p-4 border border-dashed rounded-md cursor-pointer',
					isSelected ? 'bg-primary/70' : ''
				)}
				onClick={() => {
					isSelected ? onRemove?.(media) : onSelected?.(media);
				}}
			>
				<PreviewFile
					data={data?.url ? { url: data.url, type: data.type } : null}
					progress={progress}
				/>
				<div className='text-center text-sm line-clamp-1'>{media.filename}</div>
			</div>
		</>
	);
}
