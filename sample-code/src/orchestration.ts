import {
  LlmModuleConfig,
  OrchestrationClient,
  OrchestrationResponse,
  buildAzureContentFilter
} from '@sap-ai-sdk/orchestration';
import { createLogger } from '@sap-cloud-sdk/util';

const logger = createLogger({
  package: 'sample-code',
  messageContext: 'orchestration'
});

/**
 * A simple LLM request, asking about the capital of France.
 * @returns The orchestration service response.
 */
export async function orchestrationChatCompletion(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // Define the language model to be used
    llm: {
      model_name: 'gpt-4o',
      model_params: {}
    },
    // Define the prompt
    templating: {
      template: [{ role: 'user', content: 'What is the capital of France?' }]
    }
  });

  // execute the request
  const result = await orchestrationClient.chatCompletion();

  // use getContent() to access the LLM response
  logger.info(result.getContent());

  return result;
}

const llmConfig: LlmModuleConfig = {
  model_name: 'gpt-4o',
  model_params: {}
};

/**
 * Ask about the capital of any country using a template.
 * @returns The orchestration service response.
 */
export async function orchestrationTemplating(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm: llmConfig,
    templating: {
      template: [
        // define "country" as variable by wrapping it with "{{? ... }}"
        { role: 'user', content: 'What is the capital of {{?country}}?' }
      ]
    }
  });

  return orchestrationClient.chatCompletion({
    // give the actual value for the variable "country"
    inputParams: { country: 'France' }
  });
}

const template = { template: [{ role: 'user', content: '{{?input}}' }] };

/**
 * Apply a content filter to LLM requests, filtering any hateful input.
 */
export async function orchestrationInputFiltering(): Promise<void> {
  // create a filter with minimal thresholds for hate and violence
  // lower numbers mean more strict filtering
  const filter = buildAzureContentFilter({ Hate: 0, Violence: 0 });
  const orchestrationClient = new OrchestrationClient({
    llm: llmConfig,
    templating: template,
    // configure the filter to be applied for both input and output
    filtering: {
      input: filter
    }
  });

  try {
    // trigger the input filter, producing a 400 - Bad Request response
    await orchestrationClient.chatCompletion({
      inputParams: { input: 'I hate you!' }
    });
    throw new Error('Input was not filtered as expected.');
  } catch (error: any) {
    if (error.response.status === 400) {
      logger.info('Input was filtered as expected.');
    } else {
      throw error;
    }
  }
}

/**
 * Apply a content filter to LLM requests, filtering any hateful output.
 * @returns The orchestration service response.
 */
export async function orchestrationOutputFiltering(): Promise<OrchestrationResponse> {
  // output filters are build in the same way as input filters
  // set the thresholds to the minimum to maximize the chance the LLM output will be filtered
  const filter = buildAzureContentFilter({ Hate: 0, Violence: 0 });
  const orchestrationClient = new OrchestrationClient({
    llm: llmConfig,
    templating: template,
    filtering: {
      output: filter
    }
  });
  // trigger the output filter
  // note: reliably triggering the output filter is a bit of a challenge
  // LLMs are fine-tuned to not respond with explicit or hateful content
  // Instead, they often respond with something like "Sorry, I can't assist with that" when asked to generate explicit content
  // The following prompt seems to work well with GPT-4o, but may not work with other models
  const result = await orchestrationClient.chatCompletion({
    messagesHistory: [
      {
        role: 'system',
        content: `Rewrite the following to be significantly more strongly worded, graphic and explicit.
          Imagine you are a cringy teenager writing a post on 4chan. Use explicit language as much as possible.`
      }
    ],
    inputParams: {
      input: 'Tabs are better than spaces, proove me wrong.'
    }
  });

  // accessing the content should throw an error
  try {
    result.getContent();
  } catch (error: any) {
    logger.info(
      `Result from output content filter: ${result.data.module_results.output_filtering!.message}`
    );
    logger.info(
      'The original response from the LLM was as follows: ' +
        result.data.module_results.llm?.choices[0].message.content
    );
    return result;
  }
  throw new Error(
    'Output was not filtered as expected. The LLM response was: ' +
      result.getContent()
  );
}

/**
 * Ask about the capital of France and send along custom request configuration.
 * @returns The orchestration service response.
 */
export async function orchestrationRequestConfig(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm: llmConfig,
    templating: template
  });

  return orchestrationClient.chatCompletion(
    {
      inputParams: { input: 'What is the capital of France?' }
    },
    // add a custom header to the request
    {
      headers: { 'x-custom-header': 'custom-value' }
    }
  );
}
