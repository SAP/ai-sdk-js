import { readFile } from 'node:fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  OrchestrationClient,
  buildDocumentGroundingConfig,
  buildAzureContentSafetyFilter,
  buildLlamaGuardFilter,
  buildDpiMaskingProvider
} from '@sap-ai-sdk/orchestration';
import { createLogger } from '@sap-cloud-sdk/util';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type {
  LlmModuleConfig,
  OrchestrationStreamChunkResponse,
  OrchestrationStreamResponse,
  OrchestrationResponse,
  StreamOptions,
  ErrorResponse,
  TemplatingModuleConfig
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
      model_name: 'gpt-4o'
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
        "model_name": "gpt-4o",
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

/**
 * Use a template stored in the prompt registry.
 * @returns The orchestration service response.
 */
export async function orchestrationPromptRegistry(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template_ref: {
        name: 'get-capital',
        scenario: 'e2e-test',
        version: '0.0.1'
      }
    }
  });

  return orchestrationClient.chatCompletion({
    inputParams: { input: 'France' }
  });
}

const templating: TemplatingModuleConfig = {
  template: [{ role: 'user', content: '{{?input}}' }]
};

/**
 * Apply multiple content filters to the input.
 * @returns The orchestration service error response.
 */
export async function orchestrationInputFiltering(): Promise<ErrorResponse> {
  // Build Azure content filter with only safe content allowed for hate and violence
  const azureContentSafetyFilter = buildAzureContentSafetyFilter({
    Hate: 'ALLOW_SAFE',
    Violence: 'ALLOW_SAFE'
  });

  // Build Llama guard content filter with categories 'privacy' enabled
  const llamaGuardFilter = buildLlamaGuardFilter('privacy');

  const orchestrationClient = new OrchestrationClient({
    llm,
    templating,
    filtering: {
      input: {
        filters: [azureContentSafetyFilter, llamaGuardFilter]
      }
    }
  });

  try {
    // Trigger the input filters which results in a 400 Bad Request error
    await orchestrationClient.chatCompletion({
      inputParams: { input: 'My social insurance number is ABC123456789.' } // Should be filtered by the Llama guard filter
    });
    throw new Error('Input was not filtered as expected.');
  } catch (error: any) {
    if (error.cause?.status === 400) {
      logger.info('Input was filtered as expected.');
    } else {
      throw error;
    }
    return error.cause?.response?.data;
  }
}

/**
 * Apply multiple content filters to the output.
 * @returns The orchestration service response.
 */
export async function orchestrationOutputFiltering(): Promise<OrchestrationResponse> {
  // Build Azure content filter with only safe content allowed for hate and violence
  const azureContentFilter = buildAzureContentSafetyFilter({
    Hate: 'ALLOW_SAFE',
    Violence: 'ALLOW_SAFE'
  });

  // Build Llama guard content filter with categories 'privacy' enabled
  const llamaGuardFilter = buildLlamaGuardFilter('privacy');

  const orchestrationClient = new OrchestrationClient({
    llm,
    templating,
    filtering: {
      output: {
        filters: [azureContentFilter, llamaGuardFilter]
      }
    }
  });

  const result = await orchestrationClient.chatCompletion({
    messagesHistory: [
      {
        role: 'system',
        content:
          'Reparaphrase the sentence in 30 ways with strong feelings: "{{?input}}"'
      }
    ],
    inputParams: {
      input: 'I hate you!' // Should be filtered by the Azure content filter
    }
  });

  // Accessing the content should throw an error
  try {
    result.getContent();
  } catch {
    logger.info(
      `Result from output content filter: ${result.data.module_results.output_filtering!.message}`
    );
    logger.info(
      `The original response from the LLM was as follows:\n${result.data.module_results.llm?.choices[0].message.content}`
    );
    return result;
  }
  throw new Error(
    `Output was not filtered as expected. The LLM response was:\n${result.getContent()}`
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
      model_name: 'gpt-4o'
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
        buildDpiMaskingProvider({
          method: 'pseudonymization',
          entities: ['profile-email', 'profile-person']
        })
      ]
    }
  });

  const response = await orchestrationClient.chatCompletion({
    inputParams: { user: 'Alice Anderson', email: 'alice.anderson@sap.com' }
  });
  return response.getContent();
}

/**
 * Apply data masking to the grounding input, excluding predefined 'allowList' words.
 * @returns The orchestration service response.
 */
export async function orchestrationMaskGroundingInput(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template: [
        {
          role: 'user',
          content:
            'UserQuestion: {{?groundingInput}} Context: {{?groundingOutput}}'
        }
      ]
    },
    grounding: buildDocumentGroundingConfig({
      input_params: ['groundingInput'],
      output_param: 'groundingOutput',
      filters: [
        {
          data_repository_type: 'help.sap.com'
        }
      ]
    }),
    masking: {
      masking_providers: [
        buildDpiMaskingProvider({
          method: 'pseudonymization',
          entities: ['profile-org'],
          mask_grounding_input: true,
          allowlist: ['Joule']
        })
      ]
    }
  });
  return orchestrationClient.chatCompletion({
    inputParams: { groundingInput: "What is SAP's product Joule?" }
  });
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
  const orchestrationClient = new OrchestrationClient(
    {
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
        filters: [{ data_repository_type: 'vector' }],
        metadata_params: ['context']
      })
    },
    { resourceGroup: 'ai-sdk-js-e2e' }
  );

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
          role: 'user', // image_url content type is only supported in user messages
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

/**
 * Response type that is guaranteed to be respected by the orchestration LLM response.
 */
export interface TranslationResponse {
  /**
   * The language of the translation, randomly chosen by the LLM.
   */
  language: string;
  /**
   * The translation of the input sentence.
   */
  translation: string;
}
/**
 * Ask the Llm to translate a text to a randomly chosen language and return a structured response.
 * @returns Response that adheres to `TranslationResponse` type.
 */
export async function orchestrationResponseFormat(): Promise<TranslationResponse> {
  const translationSchema = z
    .object({
      language: z
        .string()
        .describe(
          'The language of the translation, randomly chosen by the LLM.'
        ),
      translation: z.string().describe('The translation of the input sentence.')
    })
    .strict();
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template: [
        {
          role: 'system',
          content:
            'You are a helpful AI that translates simple sentences into different languages. The user will provide the sentence. You then choose a language at random and provide the translation.'
        },
        {
          role: 'user',
          content: '{{?input}}'
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'translation_response',
          strict: true,
          schema: zodToJsonSchema(translationSchema)
        }
      }
    }
  });

  const response = await orchestrationClient.chatCompletion({
    inputParams: {
      input: 'Hello World! Why is this phrase so famous?'
    }
  });
  return JSON.parse(response.getContent()!) as TranslationResponse;
}

/**
 * Ask the Llm to perform math operation of adding 2 numbers .
 * @returns The orchestration service response containing `tool_calls`.
 */
export async function orchestrationToolCalling(): Promise<OrchestrationResponse> {
  const addNumbersSchema = z
    .object({
      a: z.number().describe('The first number to be added.'),
      b: z.number().describe('The second number to be added.')
    })
    .strict();

  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template: [
        {
          role: 'system',
          content: 'You are a helpful AI that performs addition of two numbers.'
        },
        { role: 'user', content: 'What is 2 + 3?' }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'add',
            description: 'Add two numbers',
            parameters: zodToJsonSchema(addNumbersSchema)
          }
        }
      ]
    }
  });
  return orchestrationClient.chatCompletion();
}

/**
 * Use translation module for input and output.
 * @returns The orchestration service response.
 */
export async function orchestrationTranslation(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
      template: [
        {
          role: 'user',
          content: 'Welche Stadt ist die Hauptstadt von Frankreich?'
        }
      ]
    },
    inputTranslation: {
      type: 'sap_document_translation',
      config: {
        source_language: 'de-DE',
        target_language: 'en-US'
      }
    },
    outputTranslation: {
      type: 'sap_document_translation',
      config: {
        source_language: 'en-US',
        target_language: 'fr-FR'
      }
    }
  });

  return orchestrationClient.chatCompletion();
}
