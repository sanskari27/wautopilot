import Each from '@/components/containers/each';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MessagesService from '@/services/messages.service';
import { Message as TMessage } from '@/types/recipient';
import { useEffect, useRef, useState } from 'react';
import { Message } from './message-template';

export default function MessageTagsView({
	id,
	isOpen,
	onClose,
}: {
	id: string;
	isOpen: boolean;
	onClose: () => void;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);

	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const [messages, setMessages] = useState<TMessage[]>([]);
	const [messageLabels, setMessageLabels] = useState<string[]>([]);

	const handleLabelsChange = (labels: string[]) => {
		setSelectedLabels(labels);
	};

	useEffect(() => {
		if (!id) {
			return;
		}
		MessagesService.fetchConversationMessages(id, {
			page: 1,
			limit: 1000000,
		}).then((data) => {
			setMessages(data.messages);
			setMessageLabels(data.messageLabels);
		});
	}, [id]);

	const filteredMessages = messages.filter((message) => {
		return message.labels.some((tag) => selectedLabels.includes(tag));
	});

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(value) => {
				if (!value) {
					onClose();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tagged Messages</DialogTitle>
				</DialogHeader>
				<div className='pt-4'>
					<div>Tags</div>
					<div className='flex flex-wrap pb-4 gap-4'>
						<Each
							items={messageLabels}
							render={(label) => (
								<Badge
									className='cursor-pointer'
									variant={selectedLabels.includes(label) ? 'default' : 'outline'}
									onClick={() => {
										if (selectedLabels.includes(label)) {
											handleLabelsChange(selectedLabels.filter((l) => l !== label));
										} else {
											handleLabelsChange([...selectedLabels, label]);
										}
									}}
								>
									{label}
								</Badge>
							)}
						/>
					</div>
					<div className='flex flex-col items-end bg-[#ece5dd] w-full h-[500px]'>
						<div className='flex flex-col-reverse w-full overflow-y-auto p-4 flex-1'>
							<Each
								items={filteredMessages}
								render={(item, index) => (
									<div
										style={{
											display: 'flex',
											justifyContent: item.received_at ? 'flex-start' : 'flex-end',
										}}
									>
										<Message message={item} />
									</div>
								)}
							/>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
