'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useRecipient } from '@/components/context/recipients';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getInitials } from '@/lib/utils';
import { Recipient as TRecipient } from '@/types/recipient';
import { Check, Pin } from 'lucide-react';
import { RecipientContextMenu } from './contextMenu';

export default function Recipient({
	recipient,
	isActive = false,
	isSelected = false,
	onClick,
}: {
	recipient: TRecipient;
	isActive?: boolean;
	isSelected?: boolean;
	onClick?: (item: TRecipient) => void;
}) {
	const isPinned = recipient.pinned;
	const { toggleSelected } = useRecipient();
	return (
		<RecipientContextMenu recipient={recipient}>
			<div
				className={cn(
					'rounded-lg p-2 border-b cursor-pointer',
					'hover:bg-neutral-100',
					isActive && '!bg-neutral-200'
				)}
				onClick={() => onClick?.(recipient)}
			>
				<div className='flex items-center flex-col group '>
					<div className='flex gap-2 relative w-full'>
						<div className='relative'>
							<Show.ShowIf condition={isSelected}>
								<div
									className='h-12 w-12 bg-primary rounded-full flex items-center justify-center cursor-pointer'
									onClick={(e) => {
										e.stopPropagation();
										toggleSelected(recipient.id);
									}}
								>
									<Check className='text-white mx-auto h-6 w-6' />
								</div>
							</Show.ShowIf>
							<Show.ShowIf condition={!isSelected}>
								<Avatar
									className='h-12 w-12 cursor-pointer'
									onClick={(e) => {
										e.stopPropagation();
										toggleSelected(recipient.id);
									}}
								>
									<AvatarFallback className='capitalize'>
										{getInitials(recipient.profile_name) || 'NA'}
									</AvatarFallback>
								</Avatar>
							</Show.ShowIf>
							<Show.ShowIf condition={isPinned}>
								<Pin className='absolute -right-3 mr-2 w-4 h-4 top-0 rotate-45' />
							</Show.ShowIf>
						</div>
						<div className='flex-1'>
							<p className='line-clamp-1 font-medium'>
								{recipient.profile_name || recipient.recipient}
							</p>
							<p className='text-sm'>{recipient.recipient}</p>
						</div>
						<Show.ShowIf condition={recipient.unreadCount !== 0}>
							<span className='self-end text-xs bg-yellow-300 text-black inline-flex justify-center items-center p-1.5 h-[1.2rem] min-w-[1.2rem] rounded-full '>
								{recipient.unreadCount}
							</span>
						</Show.ShowIf>
					</div>
				</div>

				<div className='flex justify-start w-full overflow-x-auto mt-2 gap-1'>
					<Each
						items={recipient.labels}
						render={(label) => (
							<Badge className='min-w-max bg-gray-200 text-gray-700 font-normal'>{label}</Badge>
						)}
					/>
				</div>
			</div>
		</RecipientContextMenu>
	);
}