import { StringOutputParser } from '@langchain/core/output_parsers';
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { Runnable } from '@langchain/core/runnables';
import type { OrchestrationCallOptions } from '@sap-ai-sdk/langchain';

/**
 * Ask GPT about the capital of France, as part of a chain.
 * @returns The answer from ChatGPT.
 */
export async function invokeChain(): Promise<string> {
  const orchestrationConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-35-turbo',
      model_params: {}
    },
    // define the template
    templating: {
      template: [
        {
          role: 'user',
          content: 'Give me a long introduction of {{?input}}'
        }
      ]
    }
  };

  const callOptions = { inputParams: { input: 'SAP Cloud SDK' } };

  // initialize the client
  const client = new OrchestrationClient(orchestrationConfig);

  // create an output parser
  const parser = new StringOutputParser();

  // chain together template, client, and parser
  const llmChain = client.pipe(parser) as Runnable<BaseLanguageModelInput, string, OrchestrationCallOptions>;

  // invoke the chain
  return llmChain.invoke('My Message History', callOptions);
}
