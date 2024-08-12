import { z } from 'zod';

export const ChatbotFlowSchema = z.object({
    id: z.string(),
	name: z.string().min(1, 'Name is required'),
	trigger: z.string(),
	options: z.union([
		z.literal('INCLUDES_IGNORE_CASE'),
		z.literal('INCLUDES_MATCH_CASE'),
		z.literal('EXACT_IGNORE_CASE'),
		z.literal('EXACT_MATCH_CASE'),
	]),
    isActive: z.boolean().default(false),
});
