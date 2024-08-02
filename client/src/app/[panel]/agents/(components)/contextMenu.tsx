'use client';
import DeleteDialog from '@/components/elements/dialogs/delete';
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
import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
import { Agent } from '@/types/agent';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

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
	const router = useRouter();
	const pathname = usePathname();
	const openServiceAccount = async () => {
		toast.loading('Switching account...');
		const status = await AuthService.serviceAccount(id);
		if (status) {
			router.push('/agent/dashboard');
		} else {
			toast.error('Unable to switch account.');
		}
	};

	const deleteAgent = () => {
		const promise = AgentService.deleteAgent(id);

		toast.promise(promise, {
			loading: 'Deleting...',
			success: () => {
				router.refresh();
				return 'Agent deleted successfully';
			},
			error: 'Failed to delete agent',
		});
	};

	if (disabled) {
		return <>{children}</>;
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				<ContextMenuLink href={`${pathname}/${id}/logs`} inset>
					View Logs
				</ContextMenuLink>
				<ContextMenuLink href={`?assign-chats=${id}`} inset>
					Assign Chats
				</ContextMenuLink>
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
						<ContextMenuLink href={`?update-password=${id}`}>Change Password</ContextMenuLink>
						<ContextMenuLink onClick={openServiceAccount}>Service Account</ContextMenuLink>
						<ContextMenuSeparator />
						<DeleteDialog onDelete={deleteAgent}>
							<ContextMenuLabel className='hover:text-red-400 cursor-pointer hover:bg-accent'>
								Delete
							</ContextMenuLabel>
						</DeleteDialog>
					</ContextMenuSubContent>
				</ContextMenuSub>
			</ContextMenuContent>
		</ContextMenu>
	);
}
