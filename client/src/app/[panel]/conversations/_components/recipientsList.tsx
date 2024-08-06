'use client';
import Each from '@/components/containers/each';
import { useChatListExpanded } from '@/components/context/chat-list-expanded';
import { useRecipient } from '@/components/context/recipients';
import AgentSelector from '@/components/elements/popover/agents';
import TagsSelector from '@/components/elements/popover/tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Recipient as TRecipient } from '@/types/recipient';
import { Headset, ListFilter } from 'lucide-react';
import Recipient from './recipient';

export default function RecipientsList() {
	const { isExpanded, collapse } = useChatListExpanded();
	const {
		pinnedConversations,
		unpinnedConversations,
		setSearchText,
		setLabelFilter,
		selectedConversations,
		setSelectedRecipient,
	} = useRecipient();

	const handleRecipientClick = (item: TRecipient) => {
		collapse();
		setSelectedRecipient(item);
		// if (selected_recipient._id === item._id) return;
	};

	return (
		<div
			className={cn(
				`flex flex-col md:border-r-2 overflow-hidden md:max-w-md md:min-w-[350px] bg-white p-2`,
				isExpanded ? '!w-full' : '!hidden md:!flex'
			)}
		>
			<h3 className='font-semibold text-2xl mx-4'>Chats</h3>
			<div className='pr-2 mb-2 mr-1 md:!px-0 flex gap-x-1'>
				<div className='flex-1'>
					<Input
						type='text'
						placeholder='🔍 Search here'
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</div>
				{/* <SearchBar placeholders={['Search here']} onChange={setSearchText} /> */}
				<TagsSelector onChange={setLabelFilter}>
					<Button variant='secondary' size={'icon'}>
						<ListFilter className='w-4 h-4' strokeWidth={3} />
					</Button>
				</TagsSelector>
				{selectedConversations.length > 0 && (
					<AgentSelector onSubmit={([id]) => console.log(id)}>
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
							render={(item) => (
								<Recipient
									onClick={handleRecipientClick}
									recipient={item}
									isPinned
									isActive={false}
									isSelected={selectedConversations.includes(item._id)}
								/>
							)}
						/>
						<Each
							items={unpinnedConversations}
							render={(item, index) => (
								<Recipient
									onClick={handleRecipientClick}
									recipient={item}
									isActive={false}
									isSelected={selectedConversations.includes(item._id)}
								/>
							)}
						/>
					</>
				}
			</div>
		</div>
	);
}
