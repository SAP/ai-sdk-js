// Generated by ts-to-zod
import { z } from 'zod';

import { multiChatContentSchema } from './multi-chat-content.zod.js';

export const multiChatTemplateSchema = z.object({
  role: z.string(),
  content: z.array(multiChatContentSchema)
});
