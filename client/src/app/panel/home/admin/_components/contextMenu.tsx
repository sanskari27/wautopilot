'use client';
import Show from '@/components/containers/show';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthService from '@/services/auth.service';
import { Admin } from '@/types/admin';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
	if (disabled) {
		return <>{children}</>;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-64'>
				<DropdownMenuItem inset asChild>
					<Link href={`?upgrade-plan=${admin.id}`}>Upgrade Plan</Link>
				</DropdownMenuItem>
				<Show.ShowIf condition={admin.isSubscribed}>
					<DropdownMenuItem inset asChild>
						<Link href={`?extend-expiry=${admin.id}&admin=${JSON.stringify(admin)}`}>
							Extend Expiry
						</Link>
					</DropdownMenuItem>
				</Show.ShowIf>
				<DropdownMenuItem inset asChild>
					<Link href={`?markup-price=${admin.id}&price=${JSON.stringify(admin.markup)}`}>
						Set markup price
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={openServiceAccount} inset>
					Login as {admin.name}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
