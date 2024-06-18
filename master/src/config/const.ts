import { RiAdminFill } from 'react-icons/ri';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const WEBPAGE_URL = import.meta.env.VITE_WEBPAGE_URL;
export const DATA_LOADED_DELAY = import.meta.env.VITE_DATA_LOADED_DELAY;
export const AUTH_URL = import.meta.env.VITE_AUTH_URL;
export const LOGO_WHITE = '/images/logo-white.svg';
export const LOGO_PRIMARY = '/images/logo-primary.svg';
export const WHO = '/images/who.svg';

export const PLANS = [
	{
		_id: '6671deb40994d39d3f22a34e',
		plan_name: 'Trial',
		plan_description: 'Trial',
		plan_price: 0,
		plan_duration: 7,
		no_of_agents: 0,
		no_of_devices: 1,
	},
	{
		_id: '666ae992fc400977b7340e91',
		plan_name: 'Silver 1 @ Month',
		plan_description: 'Silver Plan 1 Month',
		plan_price: 1500,
		plan_duration: 28,
		no_of_agents: 2,
		no_of_devices: 1,
	},
	{
		_id: '666ae9f845a6b57010d025a9',
		plan_name: 'Silver 2 @ Month',
		plan_description: 'Silver Plan 2 Month',
		plan_price: 2500,
		plan_duration: 28,
		no_of_agents: 2,
		no_of_devices: 2,
	},
	{
		_id: '666ae9f945a6b57010d025b6',
		plan_name: 'Silver 2 @ Year',
		plan_description: 'Silver Plan 2 Year',
		plan_price: 25000,
		plan_duration: 336,
		no_of_agents: 2,
		no_of_devices: 2,
	},
	{
		_id: '666aea41531f14911cb79888',
		plan_name: 'Silver 3 @ Month',
		plan_description: 'Silver Plan 3 Month',
		plan_price: 5000,
		plan_duration: 28,
		no_of_agents: 2,
		no_of_devices: 5,
	},
];

export const NAVIGATION = {
	APP: '/app',
	DASHBOARD: 'dashboard',
	ADD_DEVICE: 'add-device',
	INBOX: 'inbox',
	CONTACT: 'contact',

	BROADCAST: 'broadcast',
	BROADCAST_REPORT: 'campaign-report',
	PHONEBOOK: 'phonebook',

	TEMPLATES: 'templates',
	ADD_TEMPLATE: 'add-template',
	EDIT_TEMPLATE: 'edit-template',

	MEDIA: 'media',

	ADMINS: '/admins',
};

export const MenuItems = [
	// {
	// 	icon: MdOutlineDashboard,
	// 	route: NAVIGATION.DASHBOARD,
	// 	title: 'Dashboard',
	// },
	{
		icon: RiAdminFill,
		route: NAVIGATION.ADMINS,
		title: 'Admins',
	},
];

export enum Color {
	ACCENT_LIGHT = '#E8F2ED',
	ACCENT_DARK = '#4F966E',
	PRIMARY_DARK = '#0D1C12',
	BACKGROUND_LIGHT = '#F7FCFA',
}
