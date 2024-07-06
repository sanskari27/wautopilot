import { BiBot, BiCake, BiConversation } from 'react-icons/bi';
import { MdContacts, MdOutlineDashboard, MdOutlinePermMedia } from 'react-icons/md';
import { PiLinkSimpleBold } from 'react-icons/pi';
import { RiContactsBook2Line, RiFlowChart } from 'react-icons/ri';
import { TbMessage2Plus, TbReportSearch, TbTemplate } from 'react-icons/tb';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const AGENT_URL = import.meta.env.VITE_AGENT_URL;
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
	AGENT: 'agent',

	BROADCAST: 'broadcast',
	BROADCAST_REPORT: 'campaign-report',
	PHONEBOOK: 'phonebook',
	CHATBOT: 'chatbot',
	CHATBOT_FLOW: 'chat-bot-flow',

	SHORTEN_LINKS: 'shorten-links',

	TEMPLATES: 'templates',
	ADD_TEMPLATE: 'add-template',
	EDIT_TEMPLATE: 'edit-template',

	RECURRING: 'recurring',

	MEDIA: 'media',
};

export const MenuItems = [
	{
		icon: MdOutlineDashboard,
		route: NAVIGATION.DASHBOARD,
		title: 'Dashboard',
	},
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
		icon: BiCake,
		route: NAVIGATION.RECURRING,
		title: 'Recurring',
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
	{
		icon: RiFlowChart,
		route: NAVIGATION.CHATBOT_FLOW,
		title: 'Chatbot Flow',
	},
	{
		icon: PiLinkSimpleBold,
		route: NAVIGATION.SHORTEN_LINKS,
		title: 'Short Links',
	},
];

export enum Color {
	ACCENT_LIGHT = '#E8F2ED',
	ACCENT_DARK = '#4F966E',
	PRIMARY_DARK = '#0D1C12',
	BACKGROUND_LIGHT = '#F7FCFA',
}
