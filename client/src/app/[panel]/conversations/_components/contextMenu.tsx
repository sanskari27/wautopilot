'use client';
import { useRecipient } from '@/components/context/recipients';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Recipient } from '@/types/recipient';

export function RecipientContextMenu({
	recipient,
	isPinned,
	children,
}: {
	recipient: Recipient;
	isPinned?: boolean;
	children: React.ReactNode;
}) {
	const { togglePin } = useRecipient();

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				{/* <TagsSelector onSubmit={handleAssignChats}>
					<ContextMenuLabel className='font-normal'>Assign Labels</ContextMenuLabel>
				</TagsSelector> */}
				{/* TODO add assign label dialog */}
				{isPinned ? (
					<ContextMenuItem onClick={() => togglePin(recipient._id)}>Unpin</ContextMenuItem>
				) : (
					<ContextMenuItem onClick={() => togglePin(recipient._id)}>Pin</ContextMenuItem>
				)}
			</ContextMenuContent>
		</ContextMenu>
	);
}
