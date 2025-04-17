// Generated by ts-to-zod
import { z } from 'zod';

/**
 * @internal
 **/
export const imageContentSchema = z
  .object({
    type: z.literal('image_url'),
    image_url: z.object({
      url: z.string(),
      detail: z.string().optional()
    })
  })
  .and(z.record(z.any()));
