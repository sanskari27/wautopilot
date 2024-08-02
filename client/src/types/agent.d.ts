import { Permissions } from './permissions';

export type Agent = {
	id: string;
	name: string;
	email: string;
	phone: string;
	permissions: Permissions;
};
