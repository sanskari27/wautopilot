import { MdOutlineDashboard } from 'react-icons/md';
import { RiContactsBook2Fill } from 'react-icons/ri';
import { TbMessages } from 'react-icons/tb';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const WEBPAGE_URL = import.meta.env.VITE_WEBPAGE_URL;
export const DATA_LOADED_DELAY = import.meta.env.VITE_DATA_LOADED_DELAY;

export const LOGO_WHITE = '/images/logo-white.svg';
export const LOGO_PRIMARY = '/images/logo-primary.svg';
export const WHO = '/images/who.svg';

export const NAVIGATION = {
	APP: '/app',
	LOGIN: 'login',
	RESET: 'reset-password',
	AUTH: '/auth',
	PHONEBOOK: 'phonebook',
	DASHBOARD: 'dashboard',
	INBOX: 'inbox',
	HOME: '/',
	TERMS: '/terms',
	PRIVACY: '/privacy',
	DISCLAIMER: '/disclaimer',
};

export const MenuItems = [
	{
		icon: MdOutlineDashboard,
		route: NAVIGATION.DASHBOARD,
		title: 'Dashboard',
	},
	{
		icon: TbMessages,
		route: NAVIGATION.INBOX,
		title: 'Inbox',
	},
	{
		icon: RiContactsBook2Fill,
		route: NAVIGATION.PHONEBOOK,
		title: 'Passbook',
	},
];
