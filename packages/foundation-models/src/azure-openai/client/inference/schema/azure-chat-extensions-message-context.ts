/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiCitation } from './citation.js';
/**
 *   A representation of the additional context information available when Azure OpenAI chat extensions are involved
 *   in the generation of a corresponding chat completions response. This context information is only populated when
 *   using an Azure OpenAI request configured to use a matching extension.
 */
export type AzureOpenAiAzureChatExtensionsMessageContext = {
  /**
   * The data source retrieval result, used to generate the assistant message in the response.
   */
  citations?: AzureOpenAiCitation[];
  /**
   * The detected intent from the chat history, used to pass to the next turn to carry over the context.
   */
  intent?: string;
} & Record<string, any>;
