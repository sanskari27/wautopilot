'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export type TextMessageProps = {
	onTextMessageAdded: (text: string) => void;
	children: React.ReactNode;
};

const TextMessage = ({ onTextMessageAdded, children }: TextMessageProps) => {
	const [message, setMessage] = useState('');

	const handleSave = () => {
		onTextMessageAdded(message);
	};

	return (
		<Dialog modal>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogTitle>
					<DialogTitle>Text Message</DialogTitle>
				</DialogTitle>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<p className='text-sm mt-2'>Use text message to show final output of the flow.</p>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter caption here. \nex. This is a beautiful image.'}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type='submit' disabled={!message} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

TextMessage.displayName = 'TextMessage';

export default TextMessage;
