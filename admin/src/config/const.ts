import { BiBot, BiConversation } from 'react-icons/bi';
import { MdContacts, MdOutlinePermMedia } from 'react-icons/md';
import { RiContactsBook2Line } from 'react-icons/ri';
import { TbMessage2Plus, TbReportSearch, TbTemplate } from 'react-icons/tb';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const WEBPAGE_URL = import.meta.env.VITE_WEBPAGE_URL;
export const DATA_LOADED_DELAY = import.meta.env.VITE_DATA_LOADED_DELAY;
export const AUTH_URL = import.meta.env.VITE_AUTH_URL;
export const LOGO_WHITE = '/images/logo-white.svg';
export const LOGO_PRIMARY = '/images/logo-primary.svg';
export const WHO = '/images/who.svg';

export const NAVIGATION = {
	APP: '/app',
	DASHBOARD: 'dashboard',
	ADD_DEVICE: 'add-device',
	INBOX: 'inbox',
	CONTACT: 'contact',

	BROADCAST: 'broadcast',
	BROADCAST_REPORT: 'campaign-report',
	PHONEBOOK: 'phonebook',
	CHATBOT: 'chatbot',

	TEMPLATES: 'templates',
	ADD_TEMPLATE: 'add-template',
	EDIT_TEMPLATE: 'edit-template',

	MEDIA: 'media',
};

export const MenuItems = [
	// {
	// 	icon: MdOutlineDashboard,
	// 	route: NAVIGATION.DASHBOARD,
	// 	title: 'Dashboard',
	// },
	{
		icon: RiContactsBook2Line,
		route: NAVIGATION.PHONEBOOK,
		title: 'Phonebook',
	},
	{
		icon: TbTemplate,
		route: NAVIGATION.TEMPLATES,
		title: 'Templates',
	},
	{
		icon: TbMessage2Plus,
		route: NAVIGATION.BROADCAST,
		title: 'Broadcast',
	},
	{
		icon: TbReportSearch,
		route: NAVIGATION.BROADCAST_REPORT,
		title: 'Report',
	},
	{
		icon: BiConversation,
		route: NAVIGATION.INBOX,
		title: 'Conversations',
	},
	{
		icon: MdOutlinePermMedia,
		route: NAVIGATION.MEDIA,
		title: 'Media',
	},
	{
		icon: MdContacts,
		route: NAVIGATION.CONTACT,
		title: 'Contacts',
	},
	{
		icon: BiBot,
		route: NAVIGATION.CHATBOT,
		title: 'Chat Bot',
	},
];

export enum Color {
	ACCENT_LIGHT = '#E8F2ED',
	ACCENT_DARK = '#4F966E',
	PRIMARY_DARK = '#0D1C12',
	BACKGROUND_LIGHT = '#F7FCFA',
}
