// Generated by ts-to-zod
import { z } from 'zod';
import { functionParametersSchema } from './function-parameters.zod.js';

export const functionObjectSchema = z.object({
  description: z.string().optional(),
  name: z.string(),
  parameters: functionParametersSchema.optional(),
  strict: z.boolean().optional().nullable()
});
