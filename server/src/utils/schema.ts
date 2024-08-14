import { z } from 'zod';
import { idValidator } from './ExpressUtils';

export const idsArray = z.array(
	z
		.string()
		.refine((id) => idValidator(id)[0])
		.transform((id) => idValidator(id)[1])
);
