'use client';
import DeleteDialog from '@/components/elements/dialogs/delete';
import NumberInputDialog from '@/components/elements/dialogs/numberInput';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthService from '@/services/auth.service';
import { Agent } from '@/types/agent';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { assignConversationsToAgent, deleteAgent } from '../action';

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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-64'>
				<DropdownMenuItem inset asChild>
					<Link href={`agents/logs/${id}`}>View Logs</Link>
				</DropdownMenuItem>
				<NumberInputDialog onSubmit={handleAssignChats}>
					<DropdownMenuLabel className='font-normal' inset>
						Assign Chats
					</DropdownMenuLabel>
				</NumberInputDialog>
				<DropdownMenuItem asChild inset>
					<Link href={`?permissions=${id}&data=${JSON.stringify(agent.permissions)}`}>
						Permissions
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger inset>More</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent className='w-48'>
							<DropdownMenuItem asChild>
								<Link
									href={`?edit=${id}&name=${agent.name}&email=${agent.email}&phone=${agent.phone}`}
								>
									Edit
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`?update_password=${id}`}>Change Password</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={openServiceAccount}>
								Login as {agent.name}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DeleteDialog onDelete={handleDelete}>
								<DropdownMenuLabel className='hover:text-red-400 cursor-pointer hover:bg-accent font-normal'>
									Delete
								</DropdownMenuLabel>
							</DeleteDialog>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
