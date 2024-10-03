'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
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
import { parseToSeconds, randomString } from '@/lib/utils';
import { useState } from 'react';

export type LocationRequestMessageProps = {
	onLocationRequestMessageAdded: (details: {
		text: string;
		delay: number;
		button_id: string;
		reply_to_message: boolean;
	}) => void;
	children: React.ReactNode;
};

const LocationRequestMessage = ({
	onLocationRequestMessageAdded,
	children,
}: LocationRequestMessageProps) => {
	const [reply_to_message, setReplyToMessage] = useState(false);
	const [message, setMessage] = useState('');
	const [delay, setDelay] = useState(0);
	const [delayType, setDelayType] = useState<'sec' | 'min' | 'hour'>('sec');
	const handleSave = () => {
		onLocationRequestMessageAdded({
			text: message,
			delay: parseToSeconds(delay, delayType),
			button_id: randomString(),
			reply_to_message,
		});
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
						<div className='flex items-center justify-between w-full'>
							<p className='text-sm mt-2'>Body.</p>
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
							placeholder={'Enter caption here. \nex. We need your location.'}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</div>
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
