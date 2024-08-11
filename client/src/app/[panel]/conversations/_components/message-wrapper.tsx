import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn, getInitials } from '@/lib/utils';
import { Message } from '@/types/recipient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import {
	CheckCheck,
	ChevronDown,
	History,
	Link,
	MessageCircleReply,
	PhoneCall,
} from 'lucide-react';
import { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import AssignMessageLabelDialog from './assign-message-label-dialog';

const ChatMessageWrapper = ({ message, children }: { message: Message; children: ReactNode }) => {
	const isMe = !!message.received_at;
	const sender = message.sender;

	const scrollToContext = () => {
		if (!message.context || !message.context.id) return;
		const context = document.getElementById(message.context.id);
		if (!context) {
			toast.error('Message might have been deleted or not found in the conversation');
			return;
		}
		context?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<>
			<div
				className={cn(
					'max-w-xs md:max-w-lg lg:max-w-2xl flex flex-col mb-4 ',
					isMe ? 'self-start' : 'self-end'
				)}
				id={message.message_id}
			>
				<div className={cn('flex mb-1 gap-1 items-end', isMe ? 'flex-row' : 'flex-row-reverse')}>
					<div
						className={cn(
							'group flex flex-col pl-4 pr-8 py-2 rounded-t-2xl relative',
							isMe
								? 'bg-white rounded-bl-none  rounded-br-2xl'
								: 'bg-[#dcf8c6]  rounded-bl-2xl  rounded-br-none '
						)}
					>
						<DropdownMenu>
							<DropdownMenuTrigger className='absolute right-2 !border-none !outline-none '>
								<ChevronDown
									className={cn(
										'group-hover:!text-black hidden group-hover:inline-block active:inline-block transition-none ',
										isMe ? '!text-white' : '!text-[#dcf8c6]'
									)}
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-56'>
								<AssignMessageLabelDialog selected={message.labels} id={message._id}>
									<Button variant={'ghost'} className='w-full p-2 font-normal' size={'sm'}>
										<span className='mr-auto'>Assign Tags</span>
									</Button>
								</AssignMessageLabelDialog>
							</DropdownMenuContent>
						</DropdownMenu>
						{message.context.id ? (
							<div
								className={cn(
									'cursor-pointer flex pl-2 py-1 ',
									isMe ? 'border-l-2 border-primary' : 'border-l-2 border-white'
								)}
								onClick={scrollToContext}
							>
								<p className='text-sm text-gray-500'>Show context</p>
							</div>
						) : null}
						{children}
						{message.buttons.length > 0 && (
							<>
								<Separator className='my-4 bg-gray-300' />
								<div className='flex flex-col w-full gap-y-1'>
									<Each
										items={message.buttons}
										render={(button, index) => (
											<Button
												variant={'outline'}
												className='w-full cursor-pointer text-center py-2 whitespace-pre-wrap h-max bg-transparent border-green-600'
											>
												<Show>
													<Show.When condition={button.button_type === 'URL'}>
														<Link className='w-4 h-4 mr-2' />
													</Show.When>
													<Show.When condition={button.button_type === 'QUICK_REPLY'}>
														<MessageCircleReply className='w-4 h-4 mr-2' />
													</Show.When>
													<Show.When condition={button.button_type === 'PHONE_NUMBER'}>
														<PhoneCall className='w-4 h-4 mr-2' />
													</Show.When>
												</Show>

												{button.button_content}
											</Button>
										)}
									/>
								</div>
							</>
						)}
					</div>
					{sender.id && (
						<Avatar className='w-6 h-6 inline-flex justify-center items-center'>
							<AvatarFallback className='text-xs'>{getInitials(sender.name)}</AvatarFallback>
						</Avatar>
					)}
				</div>
				<div
					className={cn('flex gap-1 items-center relative', isMe ? 'justify-start' : 'justify-end')}
				>
					{sender.name && <p className='text-xs'>Sent by {sender.name} @</p>}
					{message.delivered_at && <FormatTime time={message.read_at || message.delivered_at} />}
					{message.received_at && <FormatTime time={message.received_at} />}
					{message.read_at ? (
						<CheckCheck className='w-4 h-4 self-end text-blue-500' />
					) : message.delivered_at ? (
						<CheckCheck className='w-4 h-4 self-end text-gray-500' />
					) : message.failed_at ? (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span>
										<History className='w-4 h-4 self-end text-destructive' />
									</span>
								</TooltipTrigger>
								<TooltipContent className='!z-10'>
									<p className='bg-gray-500 text-white max-w-xs rounded-xl p-2 text-justify text-sm'>
										{message.failed_reason}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : !isMe ? (
						<History className='w-4 h-4 self-end text-gray-500' />
					) : null}
				</div>
			</div>
		</>
	);
};

const FormatTime = ({ time }: { time: string }) => {
	const formattedTime =
		new Date(time).getDate() +
		'/' +
		(new Date(time).getMonth() + 1) +
		'/' +
		new Date(time).getFullYear() +
		' ' +
		new Date(time).toLocaleTimeString();
	return <p className='text-right text-xs'>{formattedTime}</p>;
};
export default ChatMessageWrapper;
