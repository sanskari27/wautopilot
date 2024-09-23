'use client';
import { LOGO_WHITE } from '@/lib/consts';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Show from '../containers/show';
import { useDevicesDialogState } from '../context/devicesState';
import { useSettingDialogState } from '../context/settingState';
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
import { LogoutButton } from './logout-button';

export default function Navbar() {
	const { isMaster } = useUserDetails();
	const userDetails = useUserDetails();
	const { setDevices } = useDevicesDialogState();
	const { setSetting } = useSettingDialogState();
	const router = useRouter();

	function getLink(link: string) {
		return `/panel${link}`;
	}

	function openSettings() {
		setSetting(true);
	}

	function openDevices() {
		setDevices(true);
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
					<MenubarLink onClick={openDevices}>Devices</MenubarLink>
					<Show.ShowIf condition={isMaster}>
						<MenubarLink href={getLink('/home/api-webhook')}>API & Webhooks</MenubarLink>
					</Show.ShowIf>
					<Show.ShowIf condition={isMaster}>
						<MenubarSeparator />
						<MenubarLink href={getLink('/home/admin')}>Admin</MenubarLink>
						<MenubarLink href={getLink('/home/coupons')}>Coupons</MenubarLink>
						<MenubarLink href={getLink('/home/extras')}>Extras</MenubarLink>
					</Show.ShowIf>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Audience & Media</MenubarTrigger>
				<MenubarContent>
					<MenubarLink href={getLink('/audience/phonebook')}>Phonebook</MenubarLink>
					<MenubarSeparator />
					<MenubarLink href={getLink('/audience/media')}>Media</MenubarLink>
					<MenubarLink href={getLink('/audience/contacts')}>VCards</MenubarLink>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Campaigns</MenubarTrigger>
				<MenubarContent>
					<MenubarLink href={getLink('/campaigns/templates')}>Templates</MenubarLink>
					<MenubarSeparator />
					<MenubarLink href={getLink('/campaigns/broadcast')}>Broadcast</MenubarLink>
					<MenubarLink href={getLink('/campaigns/report')}>Broadcast Report</MenubarLink>
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
					<MenubarItem onClick={openSettings}>
						<CircleUserRound className='mr-2' size={'1.2rem'} />
						Account Details
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
								<li className={`relative cursor-pointer font-medium`}>
									<Link href='/docs-apiwebhook' className='hover:text-slate-300'>
										Developer Docs
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
