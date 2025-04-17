import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/foundation-models';
import { createLogger } from '@sap-cloud-sdk/util';
import type {
  AzureOpenAiChatCompletionResponse,
  AzureOpenAiEmbeddingResponse,
  AzureOpenAiChatCompletionStreamResponse,
  AzureOpenAiChatCompletionStreamChunkResponse,
  AzureOpenAiChatCompletionTool,
  AzureOpenAiChatCompletionRequestMessage,
  AzureOpenAiChatCompletionRequestToolMessage
} from '@sap-ai-sdk/foundation-models';

const logger = createLogger({
  package: 'sample-code',
  messageContext: 'foundation-models-azure-openai'
});

/**
 * Ask Azure OpenAI model about the capital of France.
 * @returns The response from Azure OpenAI containing the response content.
 */
export async function chatCompletion(): Promise<AzureOpenAiChatCompletionResponse> {
  const response = await new AzureOpenAiChatClient('gpt-4o').run({
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });

  // Use getContent() to access the content responded by LLM.
  logger.info(response.getContent());

  return response;
}

/**
 * Ask Azure OpenAI model about SAP Cloud SDK with streaming.
 * @param controller - The abort controller.
 * @returns The response from Azure OpenAI containing the response content.
 */
export async function chatCompletionStream(
  controller: AbortController
): Promise<
  AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>
> {
  const response = await new AzureOpenAiChatClient('gpt-4o').stream(
    {
      messages: [
        {
          role: 'user',
          content: 'Give me a short introduction of SAP Cloud SDK.'
        }
      ]
    },
    controller
  );
  return response;
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns The response from Azure OpenAI containing the embedding vector.
 */
export async function computeEmbedding(): Promise<AzureOpenAiEmbeddingResponse> {
  const response = await new AzureOpenAiEmbeddingClient(
    'text-embedding-3-small'
  ).run({
    input: 'Hello, world!'
  });

  // Use getEmbedding to access the embedding vector
  logger.info(response.getEmbedding());

  return response;
}

/**
 * Use custom destination to ask Azure OpenAI model about the capital of France.
 * @returns The response from Azure OpenAI containing the response content.
 */
export async function chatCompletionWithDestination(): Promise<AzureOpenAiChatCompletionResponse> {
  const response = await new AzureOpenAiChatClient('gpt-4o', {
    destinationName: 'e2e-aicore'
  }).run({
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });

  // Use getContent() to access the content responded by LLM.
  logger.info(response.getContent());

  return response;
}

/**
 * Ask Azure OpenAI model to convert temperature from Celsius to Fahrenheit using tools.
 * @returns The response from Azure OpenAI obtained using function calling.
 * Inspired by https://platform.openai.com/docs/guides/function-calling.
 */
export async function chatCompletionWithFunctionCall(): Promise<AzureOpenAiChatCompletionResponse> {
  const client = new AzureOpenAiChatClient('gpt-4o');
  const convertTemperatureTool: AzureOpenAiChatCompletionTool = {
    type: 'function',
    function: {
      name: 'convert_temperature_to_fahrenheit',
      description: 'Converts temperature from Celsius to Fahrenheit',
      parameters: {
        type: 'object',
        properties: {
          temperature: {
            type: 'number',
            description: 'The temperature value in Celsius to convert.'
          }
        },
        required: ['temperature']
      }
    }
  };
  const tools = [convertTemperatureTool];
  const messages: AzureOpenAiChatCompletionRequestMessage[] = [
    { role: 'user', content: 'Convert 20 degrees Celsius to Fahrenheit.' }
  ];

  const response = await client.run({
    messages,
    tools
  });

  const initialResponseMessage = response.data.choices[0].message;
  // Add the model's response for calling functions into the message history
  messages.push(initialResponseMessage);

  if (initialResponseMessage.tool_calls) {
    // Get the first tool call
    const toolCall = initialResponseMessage.tool_calls[0];
    const name = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);
    const toolResult = callFunction(name, args);
    const message: AzureOpenAiChatCompletionRequestToolMessage = {
      role: 'tool',
      content: toolResult,
      tool_call_id: toolCall.id
    };
    // Add the tool call result into the message history
    messages.push(message);
  }

  // Ask the model again with the updated message history
  const finalResponse = await client.run({
    messages,
    tools: [convertTemperatureTool]
  });
  return finalResponse;
}

function convertTemperatureToFahrenheit(temperature: number): string {
  return `The temperature in Fahrenheit is ${(temperature * 9) / 5 + 32}°F.`;
}

function callFunction(name: string, args: any): string {
  switch (name) {
    case 'convert_temperature_to_fahrenheit':
      return convertTemperatureToFahrenheit(args.temperature);
    default:
      throw new Error(`Function: ${name} not found!`);
  }
};
