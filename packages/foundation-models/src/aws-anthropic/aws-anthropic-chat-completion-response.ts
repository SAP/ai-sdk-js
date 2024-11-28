import type { Anthropic } from '@anthropic-ai/sdk';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

/**
 * Azure OpenAI chat completion response.
 */
export class AwsAnthropicChatCompletionResponse {
  /**
   * The chat completion response.
   */
  public readonly data: Anthropic.Message;
  constructor(public readonly rawResponse: HttpResponse) {
    this.data = rawResponse.data;
  }

  /**
   * Usage of tokens in the response.
   * @returns Token usage.
   */
  getTokenUsage(): this['data']['usage'] {
    return this.data.usage;
  }

  /**
   * Reason for stopping the completion.
   * @returns The finish reason.
   */
  getFinishReason(): string | null {
    return this.data.stop_reason;
  }

  /**
   * Parses the Aws Anthropic response and returns the content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message content.
   */
  getContent(choiceIndex = 0): string | undefined | null {
    const block = this.data.content[choiceIndex];
    if (block?.type === 'text') {
      return block.text;
    }
  }
}
