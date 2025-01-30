import { readFile } from 'node:fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  ContentFilters,
  OrchestrationClient,
  buildDocumentGroundingConfig
} from '@sap-ai-sdk/orchestration';
import { createLogger } from '@sap-cloud-sdk/util';
import type {
  LlmModuleConfig,
  OrchestrationStreamChunkResponse,
  OrchestrationStreamResponse,
  OrchestrationResponse,
  StreamOptions
} from '@sap-ai-sdk/orchestration';

const logger = createLogger({
  package: 'sample-code',
  messageContext: 'orchestration'
});

const __filename = fileURLToPath(import.meta.url);
// Navigate up by one level, to access files in the `sample-code` root instead of the transpiled `dist` folder
const __dirname = join(dirname(__filename), '..');

/**
 * A simple LLM request, asking about the capital of France.
 * @returns The orchestration service response.
 */
export async function orchestrationChatCompletion(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    // define the prompt
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

/**
 * Ask ChatGPT through the orchestration service about SAP Cloud SDK with streaming.
 * @param controller - The abort controller.
 * @param streamOptions - The stream options.
 * @returns The response from the orchestration service containing the response content.
 */
export async function chatCompletionStream(
  controller: AbortController,
  streamOptions?: StreamOptions
): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-35-turbo',
      model_params: {}
    },
    // define the prompt
    templating: {
      template: [
        {
          role: 'user',
          content: 'Give me a long introduction of {{?input}}'
        }
      ]
    }
  });

  return orchestrationClient.stream(
    { inputParams: { input: 'SAP Cloud SDK' } },
    controller,
    streamOptions
  );
}

/**
 * Ask ChatGPT through the orchestration service about SAP Cloud SDK with streaming and JSON module configuration.
 * @param controller - The abort controller.
 * @returns The response from the orchestration service containing the response content.
 */
export async function chatCompletionStreamWithJsonModuleConfig(
  controller: AbortController
): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
  const jsonConfig = `{
    "module_configurations": {
      "llm_module_config": {
        "model_name": "gpt-35-turbo",
        "model_params": {
          "stream_options": {
            "include_usage": true
          }
        }
      },
      "templating_module_config": {
        "template": [{ "role": "user", "content": "Give me a long introduction of {{?input}}" }]
      }
    }
  }`;

  const orchestrationClient = new OrchestrationClient(jsonConfig);

  return orchestrationClient.stream(
    { inputParams: { input: 'SAP Cloud SDK' } },
    controller
  );
}

const llm: LlmModuleConfig = {
  model_name: 'gpt-4o'
};

/**
 * Ask about the capital of any country using a template.
 * @returns The orchestration service response.
 */
export async function orchestrationTemplating(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
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

const templating = { template: [{ role: 'user', content: '{{?input}}' }] };

/**
 * Apply a content filter to LLM requests, filtering any hateful input.
 */
export async function orchestrationInputFiltering(): Promise<void> {
  // create a filter with minimal thresholds for hate and violence
  // lower numbers mean more strict filtering
  const azureContentFilter = ContentFilters.buildAzureContentSafety({
    Hate: 0,
    Violence: 0
  });
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating,
    // configure the filter to be applied for both input and output
    filtering: {
      input: {
        filters: [azureContentFilter]
      }
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
  const azureContentFilter = ContentFilters.buildAzureContentSafety({
    Hate: 0,
    Violence: 0
  });
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating,
    filtering: {
      output: {
        filters: [azureContentFilter]
      }
    }
  });
  /**
   * Trigger the output filter.
   * Note: reliably triggering the output filter is a bit of a challenge. LLMs are fine-tuned to not respond with explicit or hateful content.
   * Instead, they often respond with something like "Sorry, I can't assist with that" when asked to generate explicit content.
   * The following prompt seems to work well with GPT-4o, producing enough explicit language to trigger the output filter, but may not work equally well with other models.
   */
  const result = await orchestrationClient.chatCompletion({
    messagesHistory: [
      {
        role: 'system',
        content: 'Create 3 paraphrases of the sentence: "{{?input}}"'
      }
    ],
    inputParams: {
      input: 'I hate you!'
    }
  });

  // accessing the content should throw an error
  try {
    result.getContent();
  } catch {
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
 * Ask to write an e-mail while masking personal information.
 * @returns The message content from the orchestration service in the generative AI hub.
 */
export async function orchestrationCompletionMasking(): Promise<
  string | undefined
> {
  const orchestrationClient = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4-32k'
    },
    templating: {
      template: [
        {
          role: 'user',
          content:
            'Please write an email to {{?user}} ({{?email}}), informing them about the amazing capabilities of generative AI! Be brief and concise, write at most 6 sentences.'
        }
      ]
    },
    masking: {
      masking_providers: [
        {
          type: 'sap_data_privacy_integration',
          method: 'pseudonymization',
          entities: [{ type: 'profile-email' }, { type: 'profile-person' }]
        }
      ]
    }
  });

  const response = await orchestrationClient.chatCompletion({
    inputParams: { user: 'Alice Anderson', email: 'alice.anderson@sap.com' }
  });
  return response.getContent();
}

/**
 * Ask about the capital of France and send along custom request configuration.
 * @returns The orchestration service response.
 */
export async function orchestrationRequestConfig(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating
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

/**
 * Use the orchestration service with JSON obtained from AI Launchpad.
 * @returns The orchestration service response.
 */
export async function orchestrationFromJson(): Promise<
  OrchestrationResponse | undefined
> {
  // You can also provide the JSON configuration as a plain string in the code directly instead.
  const jsonConfig = await readFile(
    join(__dirname, 'src', 'model-orchestration-config.json'),
    'utf-8'
  );
  const response = await new OrchestrationClient(jsonConfig).chatCompletion();

  logger.info(response.getContent());
  return response;
}

/**
 * Ask about a custom knowledge embedded in document grounding.
 * @returns The orchestration service response.
 */
export async function orchestrationGroundingVector(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template: [
        {
          role: 'user',
          content:
            'UserQuestion: {{?groundingRequest}} Context: {{?groundingOutput}}'
        }
      ]
    },
    grounding: buildDocumentGroundingConfig({
      input_params: ['groundingRequest'],
      output_param: 'groundingOutput',
      filters: [{ id: 'filter1' }]
    })
  });

  return orchestrationClient.chatCompletion({
    inputParams: {
      groundingRequest:
        'When was the last time SAP AI SDK JavaScript end to end test was executed? Return only the latest timestamp in milliseconds without any other text.'
    }
  });
}

/**
 * Ask about Generative AI Hub in SAP AI Core and ground the response.
 * @returns The orchestration service response.
 */
export async function orchestrationGroundingHelpSapCom(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template: [
        {
          role: 'user',
          content:
            'UserQuestion: {{?groundingRequest}} Context: {{?groundingOutput}}'
        }
      ]
    },
    grounding: buildDocumentGroundingConfig({
      input_params: ['groundingRequest'],
      output_param: 'groundingOutput',
      filters: [
        {
          id: 'filter1',
          data_repository_type: 'help.sap.com'
        }
      ]
    })
  });

  return orchestrationClient.chatCompletion({
    inputParams: {
      groundingRequest: 'Give me a short introduction of SAP AI Core.'
    }
  });
}

/**
 * Ask about the image content using a template.
 * @returns The orchestration service response.
 */
export async function orchestrationChatCompletionImage(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe the image.'
            },
            {
              type: 'image_url',
              image_url: {
                url: '{{?imageUrl}}'
              }
            }
          ]
        }
      ]
    }
  });

  const imageFilePath = join(__dirname, 'src', 'media', 'sample-image.png');
  const mimeType = 'image/png';
  const encodedString = `data:${mimeType};base64,${await readFile(imageFilePath, 'base64')}`;

  return orchestrationClient.chatCompletion({
    inputParams: {
      // Alternatively, you can provide a public URL of the image here instead.
      imageUrl: encodedString
    }
  });
}
