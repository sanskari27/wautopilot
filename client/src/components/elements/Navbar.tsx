'use client';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserDetails } from '../context/user-details';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarLink,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from '../ui/menubar';
import { ThemeToggle } from '../ui/theme-toggle';
import { LogoutButton } from './logout-button';

export default function Navbar() {
	const userDetails = useUserDetails();
	const pathname = usePathname();
	let panel_id = pathname.split('/')[1];

	function getLink(link: string) {
		return `/${panel_id}${link}`;
	}

	return (
		<Menubar className=' backdrop-blur-sm px-[2%] py-4 border-t-0 border-x-0 border-b w-full'>
			<MenubarMenu>
				<MenubarTrigger>Home</MenubarTrigger>
				<MenubarContent>
					<MenubarLink href={getLink('/home/dashboard')}>Dashboard</MenubarLink>
					<MenubarSeparator />
					<MenubarLink href={getLink('/home/tasks')}>Tasks</MenubarLink>
					<MenubarSeparator />
					<MenubarLink href={getLink('/home/agents')}>Agents</MenubarLink>
					<MenubarLink href={`${pathname}?devices=true`}>Devices</MenubarLink>
					<MenubarLink href={getLink('/home/settings')}>Settings</MenubarLink>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Audience & Media</MenubarTrigger>
				<MenubarContent>
					<MenubarLink href={getLink('/audience/phonebook')}>Phonebook</MenubarLink>
					<MenubarSeparator />
					<MenubarLink href={getLink('/audience/media')}>Media</MenubarLink>
					<MenubarLink href={getLink('/audience/contacts')}>Contacts</MenubarLink>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Campaigns</MenubarTrigger>
				<MenubarContent>
					<MenubarLink href={getLink('/campaigns/templates')}>Templates</MenubarLink>
					<MenubarSeparator />
					<MenubarLink href={getLink('/campaigns/broadcast')}>Broadcast</MenubarLink>
					<MenubarLink href={getLink('/campaigns/report')}>Campaign Report</MenubarLink>
					<MenubarLink href={getLink('/campaigns/recurring')}>Recurring</MenubarLink>
					<MenubarSeparator />
					<MenubarLink href={getLink('/campaigns/chatbot')}>Chatbot</MenubarLink>
					<MenubarLink href={getLink('/campaigns/recurring')}>Chatbot flow</MenubarLink>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>
					<Link href={getLink('/conversations')}>Chats</Link>
				</MenubarTrigger>
				{/* <MenubarLink href={getLink('/conversations')}>Chats</MenubarLink> */}
			</MenubarMenu>

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
