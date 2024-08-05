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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import PreviewFile from '../preview-file';

export default function MediaSelectorDialog({
	children,
	singleSelect = false,
	selectedValue,
	onConfirm,
}: {
	children: React.ReactNode;
	selectedValue?: string[];
	singleSelect?: boolean;
	onConfirm: (media: string[]) => void;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const mediaList = useMedia();

	const [previewMode, setPreviewMode] = React.useState(false);
	const [selectedMedia, setSelectedMedia] = React.useState<string[]>(selectedValue || []);

	const handleAddMedia = (mediaId: string) => {
		if (singleSelect) {
			setSelectedMedia([mediaId]);
		} else {
			setSelectedMedia([...selectedMedia, mediaId]);
		}
	};

	const handleRemoveMedia = (mediaId: string) => {
		setSelectedMedia(selectedMedia.filter((id) => id !== mediaId));
	};

	const handleSave = () => {
		onConfirm(selectedMedia);
		buttonRef.current?.click();
		setSelectedMedia([]);
	};

	return (
		<Dialog
		>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='flex justify-between'>Select Media</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<div className='flex items-center gap-2'>
						Preview{' '}
						<Switch checked={previewMode} onCheckedChange={(checked) => setPreviewMode(checked)} />
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
										items={mediaList}
										render={(media) => (
											<TableRow>
												<TableCell>
													<Checkbox
														checked={selectedMedia.includes(media.id)}
														onCheckedChange={(checked) => {
															if (checked) {
																handleAddMedia(media.id);
															} else {
																handleRemoveMedia(media.id);
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
							<Each
								items={mediaList}
								render={(media) => {
									return (
										<>
											<div
												className={`p-4 border border-dashed rounded-md cursor-pointer ${
													selectedMedia.includes(media.id) ? 'bg-primary/10' : ''
												}`}
												onClick={() => {
													if (selectedMedia.includes(media.id)) {
														handleRemoveMedia(media.id);
													} else {
														handleAddMedia(media.id);
													}
												}}
											>
												<PreviewFile
													data={{
														type: media.mime_type,
														url: `${process.env.NEXT_PUBLIC_API_URL}media/${media.id}`,
													}}
												/>
												<div className='text-center text-sm'>{media.filename}</div>
											</div>
											<Separator className='my-2' />
										</>
									);
								}}
							/>
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
