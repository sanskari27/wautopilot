'use client';
import Show from '@/components/containers/show';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLink,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Admin } from '@/types/admin';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { switchServiceAccount } from '../action';

export function AdminContextMenu({
	children,
	id,
	disabled,
	admin,
}: {
	id: string;
	children: React.ReactNode;
	disabled?: boolean;
	admin: Admin;
}) {
	const router = useRouter();
	const openServiceAccount = async () => {
		toast.promise(switchServiceAccount(id), {
			loading: 'Switching account...',
			success: () => {
				return 'Please reload to switch account';
			},
			error: (err) => {
				console.log(err);
				return 'Failed to switch account';
			},
		});
	};
	if (disabled) {
		return <>{children}</>;
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				<ContextMenuLink href={`?upgrade-plan=${admin.id}`} inset>
					Upgrade Plan
				</ContextMenuLink>
				<Show.ShowIf condition={admin.isSubscribed}>
					<ContextMenuLink href={`?extend-expiry=${admin.id}&admin=${JSON.stringify(admin)}`} inset>
						Extend Expiry
					</ContextMenuLink>
				</Show.ShowIf>
				<ContextMenuLink
					href={`?markup-price=${admin.id}&price=${JSON.stringify(admin.markup)}`}
					inset
				>
					Set markup price
				</ContextMenuLink>
				<ContextMenuItem onClick={openServiceAccount} inset>
					Service account
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
