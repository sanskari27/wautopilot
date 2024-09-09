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

export type LocationRequestMessageProps = {
	onLocationRequestMessageAdded: (text: string) => void;
	children: React.ReactNode;
};

const LocationRequestMessage = ({
	onLocationRequestMessageAdded,
	children,
}: LocationRequestMessageProps) => {
	const [message, setMessage] = useState('');

	const handleSave = () => {
		onLocationRequestMessageAdded(message);
	};

	return (
		<Dialog modal>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogTitle>
					<DialogTitle>Location Request Message</DialogTitle>
				</DialogTitle>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<p className='text-sm mt-2'>Body</p>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter caption here. \nex. We need your location.'}
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

LocationRequestMessage.displayName = 'TextMessage';

export default LocationRequestMessage;
