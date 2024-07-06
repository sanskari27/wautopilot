export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const WEBPAGE_URL = import.meta.env.VITE_WEBPAGE_URL;
export const AUTH_URL = import.meta.env.VITE_AUTH_URL;
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
export const CAPTCHA_KEY = import.meta.env.VITE_CAPTCHA_KEY;
export const DATA_LOADED_DELAY = import.meta.env.VITE_DATA_LOADED_DELAY;

export const LOGO_WHITE = '/images/logo-white.svg';
export const LOGO_PRIMARY = '/images/logo-primary.svg';
export const WHO = '/images/who.svg';
export const NOT_FOUND = '/images/not-found.svg';

export const NAVIGATION = {
	HOME: '/',
	AUTH: '/auth',
	LOGIN: 'login',
	RESET: 'reset-password',
};

export enum Color {
	ACCENT_LIGHT = '#E8F2ED',
	ACCENT_DARK = '#4F966E',
	PRIMARY_DARK = '#0D1C12',
	BACKGROUND_LIGHT = '#F7FCFA',
}
