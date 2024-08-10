import { z } from 'zod';

export const quickReplySchema = z.object({
	message: z.string().min(1, {
		message: 'Message is required',
	}),
});
