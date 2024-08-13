'use client';
import { LOGO_WHITE } from '@/lib/consts';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserDetails } from '../context/user-details';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
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
					<MenubarLink href={getLink('/campaigns/chatbot-flow')}>Chatbot Flow</MenubarLink>
					<MenubarLink href={getLink('/campaigns/whatsapp-flow')}>Whatsapp Flow</MenubarLink>
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
						<AvatarFallback>{userDetails?.name?.charAt(0).toUpperCase() || 'P'}</AvatarFallback>
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
						<LogoutButton />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}

const HomeNavbar = () => {
	return (
		<div>
			<nav className='w-full absolute md:fixed  top-0 bg-primary z-50 h-[60px] text-accent'>
				<div className='flex items-center px-4 md:px-[5%] h-full justify-start md:justify-between'>
					<div className='w-full md:w-fit h-full flex justify-between space-x-32 items-center'>
						<Link href='/' className='inline-flex items-end'>
							<div className='inline-flex items-end justify-center gap-3'>
								<Image src={LOGO_WHITE} alt='Logo' width={40} height={40} />
								<p className='text-accent font-bold text-2xl  p-0 m-0'>Wautopilot</p>
							</div>
						</Link>
						<div className='md:inline-block hidden'>
							<ul className='flex gap-12'>
								<li className={`relative cursor-pointer font-medium`}>
									<Link href='/#works' className='hover:text-slate-300'>
										What we do
									</Link>
								</li>
								<li className={`relative cursor-pointer font-medium`}>
									<Link href='/#who' className='hover:text-slate-300'>
										Who we are
									</Link>
								</li>
								<li className={`relative cursor-pointer font-medium`}>
									<Link href='/#how' className='hover:text-slate-300'>
										How it works
									</Link>
								</li>
								{/* <li className={`relative cursor-pointer font-medium`}>
									<Link href='/#faq' className='hover:text-slate-300'>FAQ</Link>
								</li> */}
							</ul>
						</div>
					</div>
					<div className='inline-block '>
						<ul className='flex gap-6'>
							<li className={`relative cursor-pointer font-medium`}>
								<Link href='/auth/login'>
									<Button className='rounded-full bg-accent hover:bg-accent/90 text-primary '>
										<span className='font-semibold'>Try Now</span>
									</Button>
								</Link>
								{/* <Link href={`/login`} className={`flex items-center}`}> */}
								{/* <Button
									variant={'outline'}
									rounded={'full'}
									className='bg-accent text-primary-dark'
									onClick={handleClick}
								>
									Try Now
								</Button> */}
								{/* </a> */}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export { HomeNavbar };
