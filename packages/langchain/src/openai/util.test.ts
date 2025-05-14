import {
  AIMessage,
  HumanMessage,
  RemoveMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { tool } from '@langchain/core/tools';
import { parseMockResponse } from '../../../../test-util/mock-http.js';
import {
  isToolDefinition,
  mapLangchainToAiClient,
  mapOutputToChatResult,
  mapToolToOpenAiFunction
} from './util.js';
import { AzureOpenAiChatClient } from './chat.js';
import type { BaseMessage } from '@langchain/core/messages';
import type {
  AzureOpenAiCreateChatCompletionResponse,
  AzureOpenAiCreateChatCompletionRequest
} from '@sap-ai-sdk/foundation-models';
import type { AzureOpenAiChatCallOptions } from './types.js';

// Signal and Prompt Index are provided by the super class in every call
const defaultOptions = {
  signal: undefined,
  promptIndex: 0
};

describe('Mapping Functions', () => {
  it('should parse an OpenAI response to a (LangChain) chat response', async () => {
    const openAiMockResponse =
      await parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
        'foundation-models',
        'azure-openai-chat-completion-success-response.json'
      );
    const result = mapOutputToChatResult(openAiMockResponse);
    expect(result).toMatchSnapshot();
  });

  it('should parse a LangChain input to an AI SDK input', async () => {
    const langchainPrompt: BaseMessage[] = [
      new ToolMessage('Tool Test Content', 'test-id'),
      new HumanMessage('Human Test Content'),
      new SystemMessage('System Test Content'),
      new AIMessage('AI Test Content')
    ];
    const addNumbersSchema = z
      .object({
        a: z.number().describe('The first number to be added.'),
        b: z.number().describe('The second number to be added.')
      })
      .strict();

    const myTool = tool(
      ({ a, b }) => a + b,
      {
        name: 'test',
        description: 'Add two numbers',
        schema: addNumbersSchema
      }
    );

    const request: AzureOpenAiCreateChatCompletionRequest = {
      messages: [
        {
          role: 'tool',
          content: 'Tool Test Content',
          tool_call_id: 'test-id'
        },
        {
          role: 'user',
          content: 'Human Test Content'
        },
        {
          role: 'system',
          content: 'System Test Content'
        },
        {
          role: 'assistant',
          content: 'AI Test Content'
        }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'test',
            description: 'Add two numbers',
            parameters: zodToJsonSchema(addNumbersSchema)
          }
        }
      ],
      tool_choice: 'auto',
      functions: [{ name: 'random' }, { name: 'test' }]
    };
    const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
    const options: AzureOpenAiChatCallOptions = {
      tools: [myTool],
      tool_choice: 'auto',
      functions: [{ name: 'random' }, { name: 'test' }]
    };
    const mapping = mapLangchainToAiClient(client, langchainPrompt, {
      ...defaultOptions,
      ...options
    });
    expect(mapping).toMatchObject(request);
    const assistantMessage = mapping.messages.filter(
      message => message.role === 'assistant'
    )[0];
    expect(assistantMessage.tool_calls).toBeUndefined();
  });

  it('throws an error if the message type is not supported', async () => {
    const langchainPrompt: BaseMessage[] = [
      new RemoveMessage({ id: 'test-id' })
    ];
    const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
    expect(() =>
      mapLangchainToAiClient(client, langchainPrompt, defaultOptions)
    ).toThrowErrorMatchingInlineSnapshot('"Unsupported message type: remove"');
  });

  it('should type guard the correct ToolDefinition', async () => {
    expect(
      isToolDefinition({
        type: 'function',
        function: {
          name: 'test',
          description: 'Some description',
          parameters: {}
        }
      })
    ).toBe(true);
  });

  it('should not type guard the incorrect ToolDefinition', async () => {
    expect(
      isToolDefinition({
        name: 'test',
        description: 'Some description',
        parameters: {}
      })
    ).toBe(false);
  });

  describe('mapToolToOpenAiFunction', () => {
    it('should map a ToolDefinition', async () => {
      const toolInput = {
        type: 'function',
        function: {
          name: 'test',
          description: 'Some description',
          parameters: { type: 'object', properties: {} }
        }
      };

      const expectedOutput = {
        name: 'test',
        description: 'Some description',
        parameters: { type: 'object', properties: {} }
      };
      const result = mapToolToOpenAiFunction(toolInput);
      expect(result).toEqual(expectedOutput);
    });

    // TODO: Remove this test when the deprecated `functions` property is removed
    it('should still support the deprecated `functions` definition to allow optional `parameters`', async () => {
      const toolInput = {
        type: 'function',
        function: {
          name: 'test',
          description: 'Some description'
        }
      };

      const expectedOutput = {
        name: 'test',
        description: 'Some description',
        parameters: { type: 'object', properties: {} }
      };
      const result = mapToolToOpenAiFunction(toolInput);
      expect(result).toEqual(expectedOutput);
    });

    it('should map a structured tool with JSON schema', async () => {
      const toolInput = {
        name: 'test',
        description: 'Some description',
        schema: { type: 'object', properties: {} }
      };

      const expectedOutput = {
        name: 'test',
        description: 'Some description',
        parameters: { type: 'object', properties: {} }
      };
      const result = mapToolToOpenAiFunction(toolInput);
      expect(result).toEqual(expectedOutput);
    });

    it('should map a structured tool with Zod schema', async () => {
      const toolInput = {
        name: 'test',
        description: 'Some description',
        schema: z.object({
          a: z.number().describe('The first number to be added.'),
          b: z.number().describe('The second number to be added.')
        })
      };
      const expectedOutput = {
        name: 'test',
        description: 'Some description',
        parameters: {
          type: 'object',
          $schema: 'http://json-schema.org/draft-07/schema#',
          additionalProperties: false,
          properties: {
            a: {
              type: 'number',
              description: 'The first number to be added.'
            },
            b: {
              type: 'number',
              description: 'The second number to be added.'
            }
          },
          required: ['a', 'b']
        }
      };
      const result = mapToolToOpenAiFunction(toolInput);
      expect(result).toEqual(expectedOutput);
    });
  });
});
