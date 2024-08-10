'use client';
import { useRecipient } from '@/components/context/recipients';
import { Button } from '@/components/ui/button';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Recipient } from '@/types/recipient';
import AssignLabelDialog from './dialogs';

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
