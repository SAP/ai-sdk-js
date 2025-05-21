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
  isToolDefinitionLike,
  mapLangChainToAiClient,
  mapOutputToChatResult,
  mapToolToOpenAiFunction,
  mapToolToOpenAiTool
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

    const myTool = tool(({ a, b }) => a + b, {
      name: 'test',
      description: 'Add two numbers',
      schema: addNumbersSchema
    });

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
    const mapping = mapLangChainToAiClient(client, langchainPrompt, {
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
      mapLangChainToAiClient(client, langchainPrompt, defaultOptions)
    ).toThrowErrorMatchingInlineSnapshot('"Unsupported message type: remove"');
  });

  describe('isToolDefinitionLike', () => {
    it('should type guard the correct ToolDefinition', async () => {
      expect(
        isToolDefinitionLike({
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
        isToolDefinitionLike({
          name: 'test',
          description: 'Some description',
          parameters: {}
        })
      ).toBe(false);
    });

    it('should type guard the correct ToolDefinition with no parameters defined', async () => {
      expect(
        isToolDefinitionLike({
          type: 'function',
          function: {
            name: 'test',
            description: 'Some description'
          }
        })
      ).toBe(true);
    });
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
        parameters: { type: 'object', properties: {} },
        strict: false
      };
      const result = mapToolToOpenAiFunction(toolInput, false);
      expect(result).toEqual(expectedOutput);
    });

    it('should allow optional `parameters`', async () => {
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

  describe('mapToolToOpenAiTool', () => {
    it('should map OpenAI tool to itself with strict set if defined', async () => {
      const toolInput = {
        type: 'function',
        function: {
          name: 'test',
          description: 'Some description',
          parameters: { type: 'object', properties: {} }
        }
      };

      const expectedOutput = {
        type: 'function',
        function: {
          name: 'test',
          description: 'Some description',
          parameters: { type: 'object', properties: {} },
          strict: false
        }
      };
      const result = mapToolToOpenAiTool(toolInput, false);
      expect(result).toEqual(expectedOutput);
    });

    it('should map structured tool to OpenAI tool with strict unset if not defined', async () => {
      const toolInput = {
        name: 'test',
        description: 'Some description',
        schema: { type: 'object', properties: {} }
      };

      const expectedOutput = {
        type: 'function',
        function: {
          name: 'test',
          description: 'Some description',
          parameters: { type: 'object', properties: {} }
        }
      };
      const result = mapToolToOpenAiTool(toolInput);
      expect(result).toEqual(expectedOutput);
    });
  });
});
