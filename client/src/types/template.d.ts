import { templateSchema } from '@/schema/template';
import { z } from 'zod';

export type Template = z.infer<typeof templateSchema>;
