/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionTokenLogprob } from './chat-completion-token-logprob.js';
/**
 * Log probability information for the choice.
 */
export type AzureOpenAiChatCompletionChoiceLogProbs =
  | ({
      /**
       * A list of message content tokens with log probability information.
       */
      content: AzureOpenAiChatCompletionTokenLogprob[] | null;
      /**
       * A list of message refusal tokens with log probability information.
       */
      refusal?: AzureOpenAiChatCompletionTokenLogprob[] | null;
    } & Record<string, any>)
  | null;
