'use client';
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

export type ButtonMessageProps = {
	onButtonMessageAdded: (
		text: string,
		buttons: {
			id: string;
			text: string;
		}[]
	) => void;
	children: React.ReactNode;
};

const ButtonMessage = ({ onButtonMessageAdded, children }: ButtonMessageProps) => {
	const [text, setText] = useState('');
	const [buttons, setButtons] = useState<
		{
			id: string;
			text: string;
		}[]
	>([]);

	const handleSave = () => {
		onButtonMessageAdded(text, buttons);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Buttons Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<p className='text-sm mt-2'>Enter Text.</p>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter your message here. \nex. Hello, how can I help you?'}
							value={text}
							onChange={(e) => setText(e.target.value)}
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
						<Button type='submit' disabled={!text || buttons.length === 0} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

ButtonMessage.displayName = 'ButtonMessage';

export default ButtonMessage;
