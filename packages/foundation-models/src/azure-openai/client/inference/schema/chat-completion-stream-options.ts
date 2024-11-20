/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Options for streaming response. Only set this when you set `stream: true`.
 *
 */
export type AzureOpenAiChatCompletionStreamOptions =
  | ({
      /**
       * If set, an additional chunk will be streamed before the `data: [DONE]` message. The `usage` field on this chunk shows the token usage statistics for the entire request, and the `choices` field will always be an empty array. All other chunks will also include a `usage` field, but with a null value.
       *
       */
      include_usage?: boolean;
    } & Record<string, any>)
  | null;
