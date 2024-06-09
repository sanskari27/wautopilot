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

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
export const META_VERIFY_STRING = process.env.META_VERIFY_STRING ?? '';
export const META_VERIFY_USER_STRING = process.env.META_VERIFY_USER_STRING ?? '';

export const LOGO_PATH = '/static/assets/logo.png';

export enum Cookie {
	Auth = 'auth-cookie',
	Refresh = 'refresh-cookie',
}
export enum UserLevel {
	Agent = 10,
	Admin = 20,
	WhiteLabel = 30,
	Master = 100,
}

export enum Path {
	Misc = '/static/misc/',
}

export const CACHE_TIMEOUT = 60 * 60; //seconds
export const REFRESH_CACHE_TIMEOUT = 30 * 24 * 60 * 60; //seconds

export enum BROADCAST_STATUS {
	ACTIVE = 'ACTIVE',
	PAUSED = 'PAUSED',
}

export enum MESSAGE_STATUS {
	SENT = 'SENT',
	DELIVERED = 'DELIVERED',
	READ = 'READ',
	FAILED = 'FAILED',
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	PAUSED = 'PAUSED',
}

export enum MESSAGE_SCHEDULER_TYPE {
	CAMPAIGN = 'CAMPAIGN',
	INDIVIDUAL = 'INDIVIDUAL',
}
