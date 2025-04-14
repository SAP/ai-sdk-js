// Generated by ts-to-zod
import { z } from 'zod';
import { templateSchema } from './template.zod.js';
import { responseFormatTextSchema } from './response-format-text.zod.js';
import { responseFormatJsonObjectSchema } from './response-format-json-object.zod.js';
import { responseFormatJsonSchemaSchema } from './response-format-json-schema.zod.js';
import { chatCompletionToolSchema } from './chat-completion-tool.zod.js';

export const promptTemplateSpecSchema = z
  .object({
    template: z.array(templateSchema),
    defaults: z.record(z.any()).optional(),
    additionalFields: z.record(z.any()).optional(),
    response_format: z
      .union([
        responseFormatTextSchema,
        responseFormatJsonObjectSchema,
        responseFormatJsonSchemaSchema
      ])
      .optional(),
    tools: z.array(chatCompletionToolSchema).optional()
  })
  .passthrough();
