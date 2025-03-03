import { StringOutputParser } from '@langchain/core/output_parsers';
import { OrchestrationClient } from '@sap-ai-sdk/langchain';

/**
 * ASk GPT about an introduction to SAP Cloud SDK.
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
  const llmChain = client.pipe(parser);

  // invoke the chain
  return llmChain.invoke('My Message History', callOptions);
}
