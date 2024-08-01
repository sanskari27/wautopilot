'use client';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Show from '../containers/show';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from '../ui/menubar';
import { ThemeToggle } from '../ui/theme-toggle';
import { LogoutButton } from './logout-button';

export default function Navbar({ isAdmin }: Readonly<{ isAdmin: boolean }>) {
	const pathname = usePathname();
	let org_id = pathname.split('/')[2];
	const now = new Date();
	const start_date = new Date(now);
	const end_date = new Date(now);
	start_date.setHours(0, 0, 0, 0);
	end_date.setHours(23, 59, 59, 999);

	if (org_id && org_id.length !== 24) {
		org_id = '';
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'l' && e.metaKey) {
				e.preventDefault();
				window.location.href = '/organizations';
			}
			if (e.key === 'k' && e.metaKey) {
				e.preventDefault();
				window.location.href = `/organizations/${org_id}/tasks/create`;
			}
			if (e.key === 'j' && e.metaKey) {
				e.preventDefault();
				const now = new Date();
				const start_date = new Date(now);
				const end_date = new Date(now);
				start_date.setHours(0, 0, 0, 0);
				end_date.setHours(23, 59, 59, 999);

				window.location.href = `/organizations/${org_id}/tasks/my-tasks?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`;
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [org_id]);

	return (
		<Menubar className=' backdrop-blur-sm px-[2%] md:px-[7%] py-4 border-t-0 border-x-0 border-b'>
			<Show>
				<Show.When condition={!!org_id}>
					<MenubarMenu>
						<MenubarTrigger>Organization</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								<Link href='/organizations'>
									Switch Organization <MenubarShortcut>⌘L</MenubarShortcut>
								</Link>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>
								<Link href={`/organizations/${org_id}/edit`}>Organization Details</Link>
							</MenubarItem>
							<MenubarItem>
								<Link href={`/organizations/${org_id}/edit?manage_categories=true`}>
									Manage Categories
								</Link>
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger>Members</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								<Link href={`/organizations/${org_id}/employees`}>Members</Link>
							</MenubarItem>
							<MenubarItem>
								<Link href={`/organizations/${org_id}/employees/manage`}>Restructure Members</Link>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>
								<Link href={`/organizations/${org_id}/employees?invite=true`}>Invite Members</Link>
							</MenubarItem>
							<MenubarItem>
								<Link href={`/organizations/${org_id}/employees?remove=true`}>Remove Members</Link>
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger>Tasks</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								<Link href={`/organizations/${org_id}/tasks/create`}>
									Assign Task <MenubarShortcut>⌘K</MenubarShortcut>
								</Link>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>
								<Link
									href={`/organizations/${org_id}/tasks/my-tasks?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`}
								>
									My Tasks <MenubarShortcut>⌘J</MenubarShortcut>
								</Link>
							</MenubarItem>
							<MenubarItem>
								<Link
									href={`/organizations/${org_id}/tasks/delegated-tasks?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`}
								>
									Delegated Tasks
								</Link>
							</MenubarItem>
							<MenubarItem>
								<Link
									href={`/organizations/${org_id}/tasks?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`}
								>
									All Task
								</Link>
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
				</Show.When>
				<Show.When condition={isAdmin}>
					<MenubarMenu>
						<MenubarTrigger>Organization</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								<Link href='/organizations'>
									My Organizations <MenubarShortcut>⌘L</MenubarShortcut>
								</Link>
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
				</Show.When>
			</Show>
			<Show>
				<Show.When condition={isAdmin}>
					<MenubarMenu>
						<MenubarTrigger>Admin</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								<Link href='/admin'>Dashboard</Link>
							</MenubarItem>
							<MenubarItem>
								<Link href='/admin/organizations'>Organizations</Link>
							</MenubarItem>
							<MenubarItem>
								<Link href='/admin/users'>Users</Link>
							</MenubarItem>
							<MenubarItem>
								<Link href='/admin/users?organization-coupon-code=true'>Create Coupon</Link>
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
				</Show.When>
			</Show>

			<div className='flex-1' />
			<MenubarMenu>
				<MenubarTrigger>
					<Avatar className='w-8 h-8 '>
						<AvatarImage src='/profile.png' alt='settings' />
						<AvatarFallback>P</AvatarFallback>
					</Avatar>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/profile/edit`}>
							<div className='inline-flex justify-start items-center gap-2'>
								<CircleUserRound size={'1.2rem'} />
								Profile Details
							</div>
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<ThemeToggle />
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<LogoutButton />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
