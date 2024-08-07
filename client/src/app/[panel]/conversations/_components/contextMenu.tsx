'use client';
import { useRecipient } from '@/components/context/recipients';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Recipient } from '@/types/recipient';
import AssignLabelDialog from './assign-label-dialog';
import { Button } from '@/components/ui/button';

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
				<AssignLabelDialog recipient={recipient}>
					<Button size={'sm'} variant={'ghost'} className='w-full p-2 font-normal'>
						<span className='mr-auto'>Assign Label</span>
					</Button>
				</AssignLabelDialog>
			</ContextMenuContent>
		</ContextMenu>
	);
}
