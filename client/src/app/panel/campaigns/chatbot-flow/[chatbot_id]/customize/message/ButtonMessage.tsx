'use client';
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

export type ButtonMessageProps = {
	onButtonMessageAdded: (
		text: string,
		buttons: {
			id: string;
			text: string;
		}[],
		delay: number,
		reply_to_message: boolean
	) => void;
	children: React.ReactNode;
};

const ButtonMessage = ({ onButtonMessageAdded, children }: ButtonMessageProps) => {
	const [reply_to_message, setReplyToMessage] = useState(false);
	const [text, setText] = useState('');
	const [delay, setDelay] = useState(0);
	const [delayType, setDelayType] = useState<'sec' | 'min' | 'hour'>('sec');
	const [buttons, setButtons] = useState<
		{
			id: string;
			text: string;
		}[]
	>([]);

	const handleSave = () => {
		onButtonMessageAdded(text, buttons, parseToSeconds(delay, delayType), reply_to_message);
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
						<div className='flex items-center justify-between w-full'>
							<p className='text-sm mt-2'>Enter Text.</p>
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
