// Generated by ts-to-zod
import { z } from 'zod';

import { responseFormatJsonSchemaSchemaSchema } from './response-format-json-schema-schema.zod';

export const responseFormatJsonSchemaSchema = z.object({
  type: z.literal('json_schema'),
  json_schema: z.object({
    description: z.string().optional(),
    name: z.string(),
    schema: responseFormatJsonSchemaSchemaSchema.optional(),
    strict: z.boolean().optional().nullable()
  })
});
