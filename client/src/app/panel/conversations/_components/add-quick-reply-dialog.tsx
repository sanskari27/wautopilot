'use client';

import Show from '@/components/containers/show';
import { useQuickReplies } from '@/components/context/quick-replies';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import MessagesService from '@/services/messages.service';
import { Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function QuickReplyDialog({
	children,
	id,
	message: _message,
}: {
	children: React.ReactNode;
	message?: string;
	id?: string;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [message, setMessage] = useState<string>('');
	const { addQuickReply, updateQuickReply, removeQuickReply } = useQuickReplies();

	const onSubmit = () => {
		const promise = id
			? MessagesService.editQuickReply({ id, message })
			: MessagesService.addQuickReply({message});

		toast.promise(promise, {
			loading: 'Saving quick reply...',
			success: (res) => {
				onClose();
				if (id) {
					updateQuickReply(id, res.data);
				} else {
					addQuickReply(res);
				}
				return 'Quick reply saved';
			},
			error: 'Failed to save quick reply',
		});
	};

	const deleteReply = () => {
		if (!id) return;
		MessagesService.deleteQuickReply(id)
			.then(() => {
				onClose();
				removeQuickReply(id);
				toast.success('Quick reply deleted');
			})
			.catch(() => {
				toast.error('Failed to delete quick reply');
			});
	};

	const onClose = () => {
		buttonRef.current?.click();
		setMessage('');
	};

	useEffect(() => {
		setMessage(_message ?? '');
	}, [_message]);

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl w-full'>
				<DialogHeader>
					<DialogTitle>Quick reply</DialogTitle>
				</DialogHeader>
				<Textarea
					className='h-[300px]'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<DialogFooter>
					<Show.ShowIf condition={!!id}>
						<Button variant={'destructive'} onClick={deleteReply} className='mt-4'>
							<Trash strokeWidth={2} className='w-4 h-4' />
						</Button>
					</Show.ShowIf>
					<Button onClick={onSubmit} className='mt-4'>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
