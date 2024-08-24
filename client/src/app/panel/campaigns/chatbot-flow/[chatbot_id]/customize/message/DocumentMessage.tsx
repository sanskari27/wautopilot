'use client';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import AbsoluteCenter from '@/components/ui/absolute-center';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { AddButton, ListButtons } from '../_components/buttons';

export type DocumentMessageProps = {
	onDocumentMessageAdded: (
		id: string,
		caption: string,
		buttons: {
			id: string;
			text: string;
		}[]
	) => void;
	children: React.ReactNode;
};

const DocumentMessage = ({ onDocumentMessageAdded, children }: DocumentMessageProps) => {
	const [attachment, setAttachment] = useState('');
	const [caption, setCaption] = useState('');
	const [buttons, setButtons] = useState<
		{
			id: string;
			text: string;
		}[]
	>([]);

	const handleSave = () => {
		onDocumentMessageAdded(attachment, caption, buttons);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Document Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<MediaSelectorDialog
						singleSelect
						type='document'
						selectedValue={[attachment]}
						onConfirm={(ids) => ids.length > 0 && setAttachment(ids[0])}
					>
						<Button variant={'secondary'}>Select Document</Button>
					</MediaSelectorDialog>
					<div>
						<p className='text-sm'>Enter Caption.</p>
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
				<DialogFooter>
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

DocumentMessage.displayName = 'DocumentMessage';

export default DocumentMessage;
