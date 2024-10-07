'use client';
import DeleteDialog from '@/components/elements/dialogs/delete';
import NumberInputDialog from '@/components/elements/dialogs/numberInput';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuLabel,
	ContextMenuLink,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Agent } from '@/types/agent';
import { toast } from 'react-hot-toast';
import { assignConversationsToAgent, deleteAgent, switchServiceAccount } from '../action';
import AuthService from '@/services/auth.service';

export function AgentContextMenu({
	children,
	id,
	disabled,
	agent,
}: {
	id: string;
	children: React.ReactNode;
	disabled?: boolean;
	agent: Agent;
}) {
	// const pathname = usePathname();
	const openServiceAccount = async () => {
		// toast.loading('Switching account...', {
		// 	duration: 5000,
		// });
		// await switchServiceAccount(id);
		toast.promise(AuthService.serviceAccount(id), {
			loading: 'Switching account...',
			success: () => {
				window.location.href = '/panel/home/dashboard';
				return 'Please wait while we switch your account';
			},
			error: (err) => {
				return 'Failed to switch account';
			},
		});
	};

	const handleDelete = () => {
		toast.promise(deleteAgent(id), {
			loading: 'Deleting...',
			success: 'Agent deleted successfully',
			error: 'Failed to delete agent',
		});
	};

	const handleAssignChats = (numbers: string[]) => {
		toast.promise(assignConversationsToAgent(id, numbers), {
			success: 'Chats assigned successfully',
			error: 'Failed to assign chats',
			loading: 'Assigning chats...',
		});
	};

	if (disabled) {
		return <>{children}</>;
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				<ContextMenuLink href={`agents/${id}/logs`} inset>
					View Logs
				</ContextMenuLink>
				<NumberInputDialog onSubmit={handleAssignChats}>
					<ContextMenuLabel className='font-normal' inset>
						Assign Chats
					</ContextMenuLabel>
				</NumberInputDialog>
				<ContextMenuLink
					href={`?permissions=${id}&data=${JSON.stringify(agent.permissions)}`}
					inset
				>
					Permissions
				</ContextMenuLink>
				<ContextMenuSub>
					<ContextMenuSubTrigger inset>More</ContextMenuSubTrigger>
					<ContextMenuSubContent className='w-48'>
						<ContextMenuLink
							href={`?edit=${id}&name=${agent.name}&email=${agent.email}&phone=${agent.phone}`}
						>
							Edit
						</ContextMenuLink>
						<ContextMenuLink href={`?update_password=${id}`}>Change Password</ContextMenuLink>
						<ContextMenuLink onClick={openServiceAccount}>Service Account</ContextMenuLink>
						<ContextMenuSeparator />
						<DeleteDialog onDelete={handleDelete}>
							<ContextMenuLabel className='hover:text-red-400 cursor-pointer hover:bg-accent font-normal'>
								Delete
							</ContextMenuLabel>
						</DeleteDialog>
					</ContextMenuSubContent>
				</ContextMenuSub>
			</ContextMenuContent>
		</ContextMenu>
	);
}
