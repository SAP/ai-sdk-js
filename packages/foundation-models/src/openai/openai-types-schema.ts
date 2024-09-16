// Generated by ts-to-zod
import { z } from 'zod';

/**
 * @internal
 */
export const openAiChatSystemMessageSchema = z.object({
  role: z.literal('system'),
  name: z.string().optional(),
  content: z.string()
});

/**
 * @internal
 */
export const openAiChatUserMessageSchema = z.object({
  role: z.literal('user'),
  name: z.string().optional(),
  content: z.union([
    z.string(),
    z.array(
      z.union([
        z.object({
          type: z.literal('text'),
          text: z.string()
        }),
        z.object({
          type: z.literal('image_url'),
          image_url: z.union([
            z.string(),
            z.object({
              url: z.string(),
              detail: z
                .union([z.literal('auto'), z.literal('low'), z.literal('high')])
                .optional()
                .default('auto')
            })
          ])
        })
      ])
    )
  ])
});

/**
 * @internal
 */
export const openAiChatFunctionCallSchema = z.object({
  name: z.string(),
  arguments: z.string()
});

/**
 * @internal
 */
export const openAiChatToolCallSchema = z.object({
  id: z.string(),
  type: z.literal('function'),
  function: openAiChatFunctionCallSchema
});

/**
 * @internal
 */
export const openAiChatToolMessageSchema = z.object({
  role: z.literal('tool'),
  content: z.string(),
  tool_call_id: z.string()
});

/**
 * @internal
 */
export const openAiChatFunctionMessageSchema = z.object({
  role: z.literal('function'),
  content: z.string().nullable(),
  name: z.string()
});

/**
 * @internal
 */
export const openAiChatAssistantMessageSchema = z.object({
  role: z.literal('assistant'),
  name: z.string().optional(),
  content: z.string().optional(),
  function_call: openAiChatFunctionCallSchema.optional(),
  tool_calls: z.array(openAiChatToolCallSchema).optional()
});

/**
 * @internal
 */
export const openAiChatCompletionFunctionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parameters: z.record(z.unknown())
});

/**
 * @internal
 */
export const openAiChatCompletionToolSchema = z.object({
  type: z.literal('function'),
  function: openAiChatCompletionFunctionSchema
});

/**
 * @internal
 */
export const openAiCompletionParametersSchema = z.object({
  max_tokens: z.number().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  logit_bias: z.record(z.unknown()).optional(),
  user: z.string().optional(),
  n: z.number().optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  presence_penalty: z.number().optional(),
  frequency_penalty: z.number().optional()
});

/**
 * @internal
 */
export const openAiChatMessageSchema = z.union([
  openAiChatSystemMessageSchema,
  openAiChatUserMessageSchema,
  openAiChatAssistantMessageSchema,
  openAiChatToolMessageSchema,
  openAiChatFunctionMessageSchema
]);

/**
 * @internal
 */
export const openAiEmbeddingParametersSchema = z.object({
  input: z.union([z.array(z.string()), z.string()]),
  user: z.string().optional()
});

/**
 * @internal
 */
export const openAiUsageSchema = z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  total_tokens: z.number()
});

/**
 * @internal
 */
export const openAiErrorBaseSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional()
});

/**
 * @internal
 */
export const openAiContentFilterResultBaseSchema = z.object({
  filtered: z.boolean()
});

/**
 * @internal
 */
export const openAiContentFilterDetectedResultSchema =
  openAiContentFilterResultBaseSchema.extend({
    detected: z.boolean()
  });

/**
 * @internal
 */
export const openAiContentFilterSeverityResultSchema =
  openAiContentFilterResultBaseSchema.extend({
    severity: z.union([
      z.literal('safe'),
      z.literal('low'),
      z.literal('medium'),
      z.literal('high')
    ])
  });

/**
 * @internal
 */
export const openAiEmbeddingOutputSchema = z.object({
  object: z.literal('list'),
  model: z.string(),
  data: z.tuple([
    z.object({
      object: z.literal('embedding'),
      embedding: z.array(z.number()),
      index: z.number()
    })
  ]),
  usage: z.object({
    prompt_tokens: z.number(),
    total_tokens: z.number()
  })
});

/**
 * @internal
 */
export const openAiChatCompletionParametersSchema =
  openAiCompletionParametersSchema.extend({
    messages: z.array(openAiChatMessageSchema),
    response_format: z
      .object({
        type: z
          .union([z.literal('text'), z.literal('json_object')])
          .default('text')
      })
      .optional(),
    seed: z.number().optional(),
    functions: z.array(openAiChatCompletionFunctionSchema).optional(),
    tools: z.array(openAiChatCompletionToolSchema).optional(),
    tool_choice: z
      .union([
        z.literal('none'),
        z.literal('auto'),
        z.object({
          type: z.literal('function'),
          function: z.object({
            name: z.string()
          })
        })
      ])
      .optional()
  });

/**
 * @internal
 */
export const openAiContentFilterResultsBaseSchema = z.object({
  sexual: openAiContentFilterSeverityResultSchema.optional(),
  violence: openAiContentFilterSeverityResultSchema.optional(),
  hate: openAiContentFilterSeverityResultSchema.optional(),
  self_harm: openAiContentFilterSeverityResultSchema.optional(),
  profanity: openAiContentFilterDetectedResultSchema.optional(),
  error: openAiErrorBaseSchema.optional()
});

/**
 * @internal
 */
export const openAiContentFilterPromptResultsSchema =
  openAiContentFilterResultsBaseSchema.extend({
    jailbreak: openAiContentFilterDetectedResultSchema.optional()
  });

/**
 * @internal
 */
export const openAiPromptFilterResultSchema = z.object({
  prompt_index: z.number().optional(),
  content_filter_results: openAiContentFilterPromptResultsSchema.optional()
});

/**
 * @internal
 */
export const openAiCompletionOutputSchema = z.object({
  created: z.number(),
  id: z.string(),
  model: z.string(),
  object: z.union([z.literal('chat.completion'), z.literal('text_completion')]),
  usage: openAiUsageSchema,
  prompt_filter_results: z.array(openAiPromptFilterResultSchema).optional()
});

/**
 * @internal
 */
export const openAiCompletionChoiceSchema = z.object({
  finish_reason: z.string().optional(),
  index: z.number(),
  content_filter_results: openAiContentFilterPromptResultsSchema.optional()
});

/**
 * @internal
 */
export const openAiChatCompletionChoiceSchema =
  openAiCompletionChoiceSchema.extend({
    message: openAiChatAssistantMessageSchema
  });

/**
 * @internal
 */
export const openAiChatCompletionOutputSchema =
  openAiCompletionOutputSchema.extend({
    choices: z.array(openAiChatCompletionChoiceSchema),
    system_fingerprint: z.string().nullable()
  });
