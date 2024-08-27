import { z } from 'zod';
import { idValidator } from './ExpressUtils';

export const idsArray = z.array(
	z
		.string()
		.trim()
		.refine((id) => idValidator(id)[0])
		.transform((id) => idValidator(id)[1])
);

export const idSchema = z
	.string()
	.trim()
	.refine((id) => idValidator(id)[0])
	.transform((id) => idValidator(id)[1]);
