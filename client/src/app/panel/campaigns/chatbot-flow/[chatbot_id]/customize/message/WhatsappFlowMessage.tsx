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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export type WhatsappFlowMessageProps = {
	onWhatsappFlowMessageAdded: (details: {
		header: string;
		body: string;
		footer: string;
		flow_id: string;
		button_text: string;
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
	const [button_text, setButtonText] = useState('');

	const handleSave = () => {
		if (!body || !flow_id || !button_text) return;
		onWhatsappFlowMessageAdded({ header, body, footer, flow_id, button_text });
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>List Message</DialogTitle>
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
				<DialogFooter>
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
