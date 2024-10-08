'use client';
import Each from '@/components/containers/each';
import { useChatListExpanded } from '@/components/context/chat-list-expanded';
import { useRecipient } from '@/components/context/recipients';
import AgentSelector from '@/components/elements/popover/agents';
import TagsSelector from '@/components/elements/popover/tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import AgentService from '@/services/agent.service';
import { Recipient as TRecipient } from '@/types/recipient';
import { ArchiveRestore, BellDot, Headset, ListFilter } from 'lucide-react';
import toast from 'react-hot-toast';
import AgentFilter from './agent-selector';
import Recipient from './recipient';
import { PopoverAnchor } from '@radix-ui/react-popover';

export default function RecipientsList() {
	const { isExpanded, collapse } = useChatListExpanded();
	const {
		pinnedConversations,
		unpinnedConversations,
		setSearchText,
		setLabelFilter,
		selectedConversations,
		setSelectedRecipient,
		showArchived,
		showUnread,
		toggleShowArchived,
		toggleShowUnread,
		selected_recipient,
		agentFilter,
		setAgentFilter,
	} = useRecipient();

	const handleRecipientClick = (item: TRecipient) => {
		collapse();
		setSelectedRecipient(item);
		// if (selected_recipient._id === item._id) return;
	};

	const handleAssignAgent = (agentId: string) => {
		if (selectedConversations.length === 0) return;
		if (selectedConversations.length === 0) {
			const promises = selectedConversations.map((recipient) => {
				return AgentService.removeConversationFromAgent(recipient);
			});

			toast.promise(Promise.all(promises), {
				loading: 'Assigning conversation to agent',
				success: 'Conversation assigned to agent',
				error: 'Failed to assign conversation to agent',
			});
			return;
		}
		const promises = selectedConversations.map((recipient) => {
			return AgentService.assignConversationToAgent({
				agentId,
				conversationId: recipient,
			});
		});

		toast.promise(Promise.all(promises), {
			loading: 'Assigning conversation to agent',
			success: () => {
				return 'Conversation assigned to agent';
			},
			error: 'Failed to assign conversation to agent',
		});
	};

	return (
		<div
			className={cn(
				`flex flex-col md:border-r-2 overflow-hidden md:max-w-md md:min-w-[350px] bg-white p-2`,
				isExpanded ? '!w-full' : '!hidden md:!flex'
			)}
		>
			<h3 className='font-semibold text-2xl mx-4'>
				Chats
				<span className='text-sm font-normal text-neutral-500'>
					{showArchived ? ' (Archived)' : ''}
				</span>
				<span className='text-sm font-normal text-neutral-500'>
					{showUnread ? ' (Unread)' : ''}
				</span>
			</h3>
			<div className='pr-2 mb-2 mr-1 md:!px-0 flex gap-x-1'>
				<Button
					variant={showArchived ? 'default' : 'secondary'}
					size={'icon'}
					onClick={toggleShowArchived}
				>
					<ArchiveRestore className='w-4 h-4' />
				</Button>
				<Button
					variant={showUnread ? 'default' : 'secondary'}
					size={'icon'}
					onClick={toggleShowUnread}
				>
					<BellDot className='w-4 h-4' />
				</Button>
				<div className='flex-1'>
					<Input
						type='text'
						placeholder='🔍 Search here'
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</div>
				{/* <SearchBar placeholders={['Search here']} onChange={setSearchText} /> */}
				<Popover>
					<PopoverTrigger asChild>
						<Button variant='secondary' size={'icon'}>
							<ListFilter className='w-4 h-4' strokeWidth={3} />
						</Button>
					</PopoverTrigger>
					<PopoverContent  side='right' className='p-1 w-fit'>
						<div className='flex gap-1'>
							<TagsSelector onChange={setLabelFilter}>
								<Button variant='outline' size={'sm'}>
									Tag Filter
								</Button>
							</TagsSelector>
							<AgentFilter onConfirm={setAgentFilter} selected={agentFilter}>
								<Button variant='outline' size={'sm'}>
									Agent Filter
								</Button>
							</AgentFilter>
						</div>
					</PopoverContent>
				</Popover>
				{selectedConversations.length > 0 && (
					<AgentSelector onSubmit={([id]) => handleAssignAgent(id)}>
						<Button variant='secondary' size={'icon'}>
							<Headset className='w-4 h-4' />
						</Button>
					</AgentSelector>
				)}
			</div>
			<div className='flex flex-col overflow-y-scroll overflow-x-hidden h-[calc(100vh-160px)]'>
				{
					<>
						<Each
							items={pinnedConversations}
							id={(t) => t.id}
							render={(item) => (
								<Recipient
									onClick={handleRecipientClick}
									recipient={item}
									isConversationOpen={selected_recipient?.id === item.id}
									isSelected={selectedConversations.includes(item.id)}
								/>
							)}
						/>
						<Each
							items={unpinnedConversations}
							id={(t) => t.id}
							render={(item) => (
								<Recipient
									onClick={handleRecipientClick}
									recipient={item}
									isConversationOpen={selected_recipient?.id === item.id}
									isSelected={selectedConversations.includes(item.id)}
								/>
							)}
						/>
					</>
				}
			</div>
		</div>
	);
}
