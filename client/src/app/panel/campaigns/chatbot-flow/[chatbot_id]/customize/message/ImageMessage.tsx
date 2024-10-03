'use client';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import AbsoluteCenter from '@/components/ui/absolute-center';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { parseToSeconds } from '@/lib/utils';
import { useState } from 'react';
import { AddButton, ListButtons } from '../_components/buttons';

export type ImageMessageProps = {
	onImageMessageAdded: (
		id: string,
		caption: string,
		buttons: {
			id: string;
			text: string;
		}[],
		delay: number,
		reply_to_message: boolean
	) => void;
	children: React.ReactNode;
};

const ImageMessage = ({ onImageMessageAdded, children }: ImageMessageProps) => {
	const [attachment, setAttachment] = useState('');
	const [caption, setCaption] = useState('');
	const [delay, setDelay] = useState(0);
	const [delayType, setDelayType] = useState<'sec' | 'min' | 'hour'>('sec');
	const [buttons, setButtons] = useState<
		{
			id: string;
			text: string;
		}[]
	>([]);
	const [reply_to_message, setReplyToMessage] = useState(false);

	const handleSave = () => {
		onImageMessageAdded(
			attachment,
			caption,
			buttons,
			parseToSeconds(delay, delayType),
			reply_to_message
		);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Image Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<MediaSelectorDialog
						type='image'
						singleSelect
						selectedValue={[attachment]}
						onConfirm={(ids) => ids.length > 0 && setAttachment(ids[0])}
					>
						<Button variant={'secondary'}>Select Image</Button>
					</MediaSelectorDialog>
					<div>
						<div className='flex items-center justify-between w-full'>
							<p className='text-sm mt-2'>Enter Caption.</p>
							<div className='space-y-0 inline-flex items-center gap-2'>
								<Checkbox
									checked={reply_to_message}
									onCheckedChange={(checked) => setReplyToMessage(checked.valueOf() as boolean)}
								/>
								<div className='text-sm'>Reply</div>
							</div>
						</div>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter caption here. \nex. This is a beautiful image.'}
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
						/>
					</div>
					<AbsoluteCenter>Reply Back Buttons</AbsoluteCenter>
					<ListButtons
						buttons={buttons}
						onRemove={(id) => setButtons(buttons.filter((el) => el.id !== id))}
					/>

					<AddButton
						isDisabled={buttons.length >= 3}
						onSubmit={(data) => setButtons([...buttons, data])}
					/>
				</div>
				<Separator />
				<DialogFooter>
					<div className='inline-flex items-center gap-2 mr-auto'>
						<p className='text-sm'>Send after</p>
						<Input
							className='w-20'
							placeholder={'Enter delay in seconds'}
							value={delay.toString()}
							onChange={(e) => setDelay(Number(e.target.value))}
						/>
						<Select
							value={delayType}
							onValueChange={(val: 'sec' | 'min' | 'hour') => setDelayType(val)}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select one' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value='sec'>Seconds</SelectItem>
									<SelectItem value='min'>Minutes</SelectItem>
									<SelectItem value='hour'>Hours</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<DialogClose asChild>
						<Button type='submit' disabled={!attachment || !caption} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

ImageMessage.displayName = 'ImageMessage';

export default ImageMessage;
