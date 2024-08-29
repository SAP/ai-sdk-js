/**
 * TODO:
 * 1. Decide on constructor (what defaults to set)
 * 2. Overwrite _generate method
 * 3. Call our OpenAI client
 * 4. (Optional) Handle streaming
 * 5. Parse response
 */

import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import { LLMResult } from '@langchain/core/outputs';
import { OpenAI, OpenAIInput } from '@langchain/openai';
import { OpenAiClient } from '@sap-ai-sdk/gen-ai-hub';
import { OpenAiChatCompletionParameters, OpenAiChatMessage, OpenAiChatModel } from '@sap-ai-sdk/gen-ai-hub';

/**
 *   async chatCompletion(
    model: OpenAiChatModel | { name: OpenAiChatModel; version: string },
    data: OpenAiChatCompletionParameters,
    deploymentResolver?: DeploymentResolver,
    requestConfig?: CustomRequestConfig
 */

interface ModelDeployment {
    modelName: OpenAiChatModel | { name: OpenAiChatModel, version: string }
}

/**
 * Input for Text generation for OpenAI GPT.
 */
// ASSUMPTION: We remove all these types from OpenAIInput, because we assume that the types in OpenAiChatCompletionParameters are the correct ones
export interface OpenAIInputParameters
  extends Omit<OpenAIInput, 'temperature' | 'stop' | 'n' | 'modelName' | 'model' | 'openAIApiKey' | 'streaming'>,
    OpenAiChatCompletionParameters,
    BaseLLMParams,
    ModelDeployment {}

/**
 * OpenAI GPT Language Model Wrapper to generate texts.
 */
export class BTPOpenAIGPT extends OpenAI implements OpenAIInputParameters {
  private openAiClient: OpenAiClient;

  deployment_id: BTPOpenAIGPTTextModel;
  modelName: OpenAiChatModel
  messages: OpenAiChatMessage[];

  constructor(fields: Partial<OpenAIInputParameters>) {
    super({ ...fields, stop: [], n: 1, modelName: '', openAIApiKey: 'dummy' });
    this.modelName = fields?.modelName as OpenAiChatModel;
    this.stop = fields?.stop as any;
    this.n = fields?.n as any;
    this.messages = fields.messages;


    this.deployment_id = fields?.deployment_id ?? 'text-davinci-003';

    // LLM client
    this.openAiClient = new OpenAiClient();
  }

  override async _generate(
    prompts: string[],
    options: this['ParsedCallOptions'],
    runManager?: CallbackManagerForLLMRun,
  ): Promise<LLMResult> {
    const res = await this.caller.callWithOptions(
      {
        signal: options.signal,
      },
      () =>
        this.openAiClient.chatCompletion(this.modelName, 
          {
            // replace with messages thingy
            messages: this.messages,
            max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
            temperature: this.temperature,
            top_p: this.topP,
            logit_bias: this.logitBias,
            n: this.n,
            stop: options?.stop ?? this.stop,
            presence_penalty: this.presencePenalty,
            frequency_penalty: this.frequencyPenalty,
          }
        ),
    );

    // currently BTP LLM Proxy for OpenAI doesn't support streaming
    // ASSUMPTION: assuming we only offer chat models -> we can cast the response to string as this is always the expected output
    await runManager?.handleLLMNewToken(res.choices[0].message.content as string);

    return {
      generations: res.choices.map((c) => [
        {
          text: c.text,
          generationInfo: {
            finish_reason: c.finish_reason,
            index: c.index,
            logprobs: c.logprobs,
          },
        },
      ]),
      llmOutput: {
        created: res.created,
        id: res.id,
        model: res.model,
        object: res.object,
        tokenUsage: {
          completionTokens: res.usage.completion_tokens,
          promptTokens: res.usage.prompt_tokens,
          totalTokens: res.usage.total_tokens,
        },
      },
    };
  }
}

/**
 * @deprecated Use {@link BTPOpenAIGPT} instead.
 */
export const BTPOpenAI = BTPOpenAIGPT;
