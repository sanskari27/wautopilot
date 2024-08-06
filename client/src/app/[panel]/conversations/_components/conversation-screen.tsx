'use client';
import Show from '@/components/containers/show';
import { useChatListExpanded } from '@/components/context/chat-list-expanded';
import { useRecipient } from '@/components/context/recipients';
import ExpiryCountdown from '@/components/elements/expiry-countdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useMessages from '@/hooks/useMessages';
import { getInitials } from '@/lib/utils';
import { ChevronLeft, EllipsisVertical } from 'lucide-react';
import { useEffect } from 'react';
import MessagesList from './messages-list';

export default function ConversationScreen() {
	const { selected_recipient: recipient } = useRecipient();
	const { expand } = useChatListExpanded();
	const { loading, expiry, messages, loadMore } = useMessages(recipient?._id ?? '');

	if (!recipient) return null;

	return (
		<div className='w-full'>
			<div className='flex p-4 border-b-2 justify-between w-full'>
				<div className='flex gap-3'>
					<ChevronLeft className='block md:!hidden' onClick={expand} />
					<Avatar>
						<AvatarFallback>{getInitials(recipient.profile_name) || 'Unknown'}</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-medium'>{recipient.profile_name}</p>
						<p className='text-sm'>{recipient.recipient}</p>
					</div>
				</div>
				<div className='flex'>
					<div className='flex items-center gap-3'>
						<Show.ShowIf condition={!loading}>
							<ExpiryCountdown timeLeft={expiry === 'EXPIRED' ? 0 : expiry} />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size={'icon'}>
										<EllipsisVertical className='w-4 h-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='w-56'>
									<DropdownMenuItem>View Messages Tags</DropdownMenuItem>
									<DropdownMenuItem>Conversation Notes</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</Show.ShowIf>
					</div>
				</div>
			</div>

			<div className='flex w-full h-[calc(100vh-140px)] bg-[#ece5dd] items-end flex-col'>
				{loading && <p className='text-gray-500 text-center text-lg w-full'>loading...</p>}
				<div className='flex flex-col-reverse w-full overflow-y-auto p-4 h-full'>
					<MessagesList list={messages} onLastReached={loadMore} />
				</div>
			</div>
		</div>
	);
}
