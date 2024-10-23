import { createLogger } from '@sap-cloud-sdk/util';
import { Stream } from './azure-openai-streaming.js';
import { AzureOpenAiCompletionUsage } from './client/inference/schema/completion-usage.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream-response'
});

/**
 * Azure OpenAI chat completion stream response.
 */
export class AzureOpenAiChatCompletionStreamResponse {

  public usage: AzureOpenAiCompletionUsage | undefined;
  public finishReason: 'stop' | 'length' | 'content_filter' | undefined;
  public stream: Stream<any> | undefined;
}
