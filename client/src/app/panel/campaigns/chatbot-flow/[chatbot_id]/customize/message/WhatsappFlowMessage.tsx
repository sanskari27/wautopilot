'use client';
import WhatsappFlowSelector from '@/components/elements/wa-flow-selector';
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

export type WhatsappFlowMessageProps = {
	onWhatsappFlowMessageAdded: (details: {
		header: string;
		body: string;
		footer: string;
		flow_id: string;
		button: {
			id: string;
			text: string;
		};
		delay: number;
	}) => void;
	children: React.ReactNode;
};

const WhatsappFlowMessage = ({
	onWhatsappFlowMessageAdded,
	children,
}: WhatsappFlowMessageProps) => {
	const [header, setHeader] = useState('');
	const [body, setBody] = useState('');
	const [footer, setFooter] = useState('');
	const [flow_id, setFlowId] = useState('');
	const [delay, setDelay] = useState(0);
	const [delayType, setDelayType] = useState<'sec' | 'min' | 'hour'>('sec');
	const [button_text, setButtonText] = useState('');

	const handleSave = () => {
		if (!body || !flow_id || !button_text) return;
		onWhatsappFlowMessageAdded({
			header,
			body,
			footer,
			flow_id,
			button: {
				id: randomString(),
				text: button_text,
			},
			delay: parseToSeconds(delay, delayType),
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Whatsapp Flow Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<p className='text-sm mt-2'>Enter Header Text</p>
						<Input
							placeholder={'Enter your header text here.'}
							value={header}
							onChange={(e) => setHeader(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Body Text</p>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter your body text here.'}
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Footer Text</p>
						<Input
							placeholder={'Enter your footer text here.'}
							value={footer}
							onChange={(e) => setFooter(e.target.value)}
						/>
					</div>

					<Separator className='bg-gray-400' />

					<div>
						<p className='text-sm mt-2'>Select Whatsapp Flow</p>
						<WhatsappFlowSelector
							onChange={({ id }) => setFlowId(id)}
							value={flow_id}
							placeholder='Select flow...'
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Button Text</p>
						<Input
							placeholder={'Enter your cta button text here.'}
							value={button_text}
							onChange={(e) => setButtonText(e.target.value)}
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
						<Button type='submit' disabled={!body || !flow_id || !button_text} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

WhatsappFlowMessage.displayName = 'WhatsappFlowMessage';

export default WhatsappFlowMessage;
