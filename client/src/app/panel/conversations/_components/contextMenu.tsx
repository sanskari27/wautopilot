'use client';
import { Button } from '@/components/ui/button';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import MessagesService from '@/services/messages.service';
import { Recipient } from '@/types/recipient';
import AssignLabelDialog from './dialogs';

export function RecipientContextMenu({
	recipient,
	children,
}: {
	recipient: Recipient;
	children: React.ReactNode;
}) {
	const isPinned = recipient.pinned;
	const isArchived = recipient.archived;
	
	function togglePin() {
		MessagesService.togglePin(recipient.id);
	}

	function toggleArchive() {
		MessagesService.toggleArchive(recipient.id);
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				{isPinned ? (
					<ContextMenuItem onClick={togglePin}>Unpin</ContextMenuItem>
				) : (
					<ContextMenuItem onClick={togglePin}>Pin</ContextMenuItem>
				)}
				{isArchived ? (
					<ContextMenuItem onClick={toggleArchive}>Unarchive</ContextMenuItem>
				) : (
					<ContextMenuItem onClick={toggleArchive}>Archive</ContextMenuItem>
				)}
				<AssignLabelDialog recipient={recipient}>
					<Button size={'sm'} variant={'ghost'} className='w-full p-2 font-normal'>
						<span className='mr-auto'>Assign Tags</span>
					</Button>
				</AssignLabelDialog>
			</ContextMenuContent>
		</ContextMenu>
	);
}
