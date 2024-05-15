export const DATABASE_URL = process.env.DATABASE_URL as string;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_WINDOWS = process.env.OS === 'WINDOWS';

export const PORT = process.env.PORT !== undefined ? process.env.PORT : undefined;

export const JWT_SECRET = process.env.JWT_SECRET ?? 'jwt-secret';
export const JWT_EXPIRE = process.env.JWT_EXPIRE ?? '3minutes';
export const REFRESH_SECRET = process.env.REFRESH_SECRET ?? 'refresh-secret';
export const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE ?? '28days';
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60;

export const COOKIE_DOMAIN_VALUE = process.env.COOKIE_DOMAIN_VALUE ?? 'localhost';

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? 'RESEND_API_KEY';

export enum Cookie {
	Auth = 'auth-cookie',
	Refresh = 'refresh-cookie',
}
export enum UserLevel {
	User = 1,
	Admin = 10,
}

export enum Path {
	Misc = '/static/misc/',
}

export const CACHE_TIMEOUT = 60 * 60; //seconds
export const REFRESH_CACHE_TIMEOUT = 30 * 24 * 60 * 60; //seconds
