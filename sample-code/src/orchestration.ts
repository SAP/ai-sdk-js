import { readFile } from 'node:fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  OrchestrationClient,
  buildDocumentGroundingConfig,
  buildAzureContentSafetyFilter,
  buildLlamaGuardFilter,
  buildDpiMaskingProvider,
  buildTranslationConfig
} from '@sap-ai-sdk/orchestration';
import { createLogger } from '@sap-cloud-sdk/util';
// eslint-disable-next-line import/no-internal-modules
import * as z from 'zod/v4';
import { toJsonSchema } from '@langchain/core/utils/json_schema';
import type {
  OrchestrationStreamChunkResponse,
  OrchestrationStreamResponse,
  OrchestrationResponse,
  StreamOptions,
  ErrorResponse,
  ChatCompletionTool,
  ToolChatMessage,
  DataRepositoryType
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
    }
  });

  // execute the request
  const result = await orchestrationClient.chatCompletion({
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });

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
    }
  });

  return orchestrationClient.stream(
    {
      messages: [
        {
          role: 'user',
          content: 'Give me a long introduction of SAP Cloud SDK.'
        }
      ]
    },
    controller,
    streamOptions
  );
}

/**
 * Ask about the capital of any country using a template.
 * @returns The orchestration service response.
 */
export async function orchestrationTemplating(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
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

/**
 * Chat request to OpenAI through the Orchestration service using message history.
 * @returns The orchestration service response.
 */
export async function orchestrationMessageHistory(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    }
  });

  const firstResponse = await orchestrationClient.chatCompletion({
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });

  // User can then ask a follow-up question
  const nextResponse = await orchestrationClient.chatCompletion({
    messages: [{ role: 'user', content: 'What is the typical food there?' }],
    messagesHistory: firstResponse.getAllMessages()
  });

  return nextResponse;
}

/**
 * Use a template stored in the prompt registry.
 * @returns The orchestration service response.
 */
export async function orchestrationPromptRegistry(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
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
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    filtering: {
      input: {
        filters: [azureContentSafetyFilter, llamaGuardFilter]
      }
    }
  });

  try {
    // Trigger the input filters which results in a 400 Bad Request error
    await orchestrationClient.chatCompletion({
      messages: [
        { role: 'user', content: 'My social insurance number is ABC123456789.' }
      ] // Should be filtered by the Llama guard filter
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
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    filtering: {
      output: {
        filters: [azureContentFilter, llamaGuardFilter]
      }
    }
  });

  const result = await orchestrationClient.chatCompletion({
    messages: [
      {
        role: 'user',
        // Should be filtered by the Azure content filter
        content:
          'Reparaphrase the sentence in 30 ways with strong feelings: "I hate you!"'
      }
    ]
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
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    masking: {
      masking_providers: [
        buildDpiMaskingProvider({
          method: 'pseudonymization',
          entities: [
            'profile-email',
            {
              type: 'profile-person',
              replacement_strategy: {
                method: 'fabricated_data'
              }
            },
            {
              type: 'custom',
              regex: '\\b[0-9]{4}-[0-9]{4}-[0-9]{3,5}\\b',
              replacement_strategy: {
                method: 'constant',
                value: 'REDACTED_ID'
              }
            },
            {
              type: 'custom',
              regex: '[0-9]{4}[-/][0-9]{2}[-/][0-9]{2}',
              replacement_strategy: {
                method: 'constant',
                value: 'REDACTED_DATE'
              }
            }
          ]
        })
      ]
    }
  });

  const response = await orchestrationClient.chatCompletion({
    messages: [
      {
        role: 'user',
        content:
          'Write a professional email to my doctor, {{?user}}, at {{?email}}, asking to reschedule my appointment originally set for 2024-12-15 due to a personal conflict. My patient ID is 8947-2219-550.'
      }
    ],
    inputParams: {
      user: 'Dr. Emily Smith',
      email: 'emily.smith@healthclinic.com'
    }
  });
  return response.getContent();
}

/**
 * Apply data masking to the grounding input, excluding predefined 'allowList' words.
 * @returns The orchestration service response.
 */
export async function orchestrationMaskGroundingInput(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
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
    messages: [
      {
        role: 'user',
        content:
          'UserQuestion: {{?groundingInput}} Context: {{?groundingOutput}}'
      }
    ],
    inputParams: { groundingInput: "What is SAP's product Joule?" }
  });
}

/**
 * Ask about the capital of France and send along custom request configuration.
 * @returns The orchestration service response.
 */
export async function orchestrationRequestConfig(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    }
  });

  return orchestrationClient.chatCompletion(
    {
      messages: [{ role: 'user', content: 'What is the capital of France?' }]
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
 * @param query - The query to ask.
 * @param dataRepositoryType - The type of data repository to use.
 * @param dataRepositories - The data repositories to use for grounding.
 * @returns The orchestration service response.
 */
export async function orchestrationGrounding(
  query: string,
  dataRepositoryType: DataRepositoryType = 'vector',
  dataRepositories: string[] = ['*']
): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient(
    {
      // define the language model to be used
      llm: {
        model_name: 'gpt-4o'
      },
      grounding: buildDocumentGroundingConfig({
        input_params: ['groundingRequest'],
        output_param: 'groundingOutput',
        filters: [
          {
            data_repository_type: dataRepositoryType,
            data_repositories: dataRepositories
          }
        ],
        ...(dataRepositoryType !== 'help.sap.com' && {
          metadata_params: ['context']
        })
      })
    },
    { resourceGroup: 'ai-sdk-js-e2e' }
  );

  return orchestrationClient.chatCompletion({
    messages: [
      {
        role: 'user',
        content:
          'UserQuestion: {{?groundingRequest}} Context: {{?groundingOutput}}'
      }
    ],
    inputParams: {
      groundingRequest: query
    }
  });
}

/**
 * Ask about the image content using a template.
 * @returns The orchestration service response.
 */
export async function orchestrationChatCompletionImage(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    }
  });

  const imageFilePath = join(__dirname, 'src', 'media', 'sample-image.png');
  const mimeType = 'image/png';
  const encodedString = `data:${mimeType};base64,${await readFile(imageFilePath, 'base64')}`;

  return orchestrationClient.chatCompletion({
    messages: [
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
    ],
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
      language: z.string().meta({
        description:
          'The language of the translation, randomly chosen by the LLM.'
      }),
      translation: z
        .string()
        .meta({ description: 'The translation of the input sentence.' })
    })
    .strict();
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    templating: {
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'translation_response',
          strict: true,
          schema: toJsonSchema(translationSchema)
        }
      }
    }
  });

  const response = await orchestrationClient.chatCompletion({
    messages: [
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
    inputParams: {
      input: 'Hello World! Why is this phrase so famous?'
    }
  });
  return JSON.parse(response.getContent()!) as TranslationResponse;
}

const addNumbersSchema = z
  .object({
    a: z.number().meta({ description: 'The first number to be added.' }),
    b: z.number().meta({ description: 'The second number to be added.' })
  })
  .strict();

const addNumbersTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'add',
    description: 'Add two numbers',
    parameters: toJsonSchema(addNumbersSchema)
  }
};

/**
 * Send a chat completion request to the Orchestration service using tools and pass the message history in a subsequent chat completion request.
 * @returns The orchestration service response containing `tool_calls`.
 */
export async function orchestrationMessageHistoryWithToolCalling(): Promise<OrchestrationResponse> {
  // The tool that performs the calculation
  const addTwoNumbers = (first: number, second: number): string =>
    `The sum of ${first} and ${second} is ${first + second}.`;

  // Routing tool calls to their corresponsing implementation
  const callFunction = (name: string, args: any): string => {
    switch (name) {
      case 'add':
        return addTwoNumbers(args.a, args.b);
      default:
        throw new Error(`Function: ${name} not found!`);
    }
  };

  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    templating: {
      tools: [addNumbersTool]
    }
  });

  const response = await orchestrationClient.chatCompletion({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI that performs addition of two numbers.'
      },
      { role: 'user', content: 'What is 2 + 3?' }
    ]
  });
  const allMessages = response.getAllMessages();
  const initialResponse = response.getAssistantMessage();
  let toolMessage: ToolChatMessage;
  // Use the initial response to execute the tool and get the response.
  if (initialResponse && initialResponse.tool_calls) {
    const toolCall = initialResponse.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);
    toolMessage = {
      role: 'tool',
      content: callFunction(toolCall.function.name, args),
      tool_call_id: toolCall.id
    };
  } else {
    throw new Error('No tool call found in the response.');
  }

  // Call the model with a new message and the message history
  return orchestrationClient.chatCompletion({
    messages: [toolMessage],
    messagesHistory: allMessages
  });
}

/**
 * Use translation module for input and output translation.
 * @returns The orchestration service response.
 */
export async function orchestrationTranslation(): Promise<OrchestrationResponse> {
  const orchestrationClient = new OrchestrationClient({
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    inputTranslation: buildTranslationConfig({
      sourceLanguage: 'en-US',
      targetLanguage: 'de-DE'
    }),
    outputTranslation: buildTranslationConfig({
      sourceLanguage: 'de-DE',
      targetLanguage: 'fr-FR'
    })
  });

  return orchestrationClient.chatCompletion({
    messages: [
      {
        role: 'user',
        content: 'Write an abstract for a thriller playing at SAP headquarters.'
      }
    ]
  });
}

/**
 * Ask ChatGPT to add two numbers using tools and stream the response.
 * @param controller - The abort controller.
 * @param streamOptions - The stream options.
 * @returns The response from the orchestration service containing the response content.
 */
export async function chatCompletionStreamWithTools(
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
      tools: [addNumbersTool]
    }
  });
  return orchestrationClient.stream(
    {
      messages: [
        { role: 'user', content: 'Add the numbers 2 and 3, as well as 4 and 5' }
      ]
    },
    controller,
    streamOptions
  );
}
