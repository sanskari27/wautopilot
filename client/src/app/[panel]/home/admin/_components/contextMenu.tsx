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
	// const openServiceAccount = async () => {
	// 	const status = await AuthService.serviceAccount(admin.id);
	// 	if (status) {
	// 		window.location.href = ADMIN_URL;
	// 	} else {
	// 		toast({
	// 			title: 'Unable to switch account.',
	// 			description: 'Please try again later.',
	// 			status: 'error',
	// 		});
	// 	}
	// };

	if (disabled) {
		return <>{children}</>;
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				<Show.ShowIf condition={admin.isSubscribed}>
					<ContextMenuLink href={`?upgrade-plan=${admin.id}`} inset>
						Upgrade Plan
					</ContextMenuLink>
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
				<ContextMenuItem inset>Service account</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
