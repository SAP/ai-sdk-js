import {
  AIMessage,
  HumanMessage,
  RemoveMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { toJsonSchema } from '@langchain/core/utils/json_schema';

import { parseMockResponse } from '../../../../test-util/mock-http.ts';
import {
  addNumbersSchema,
  addNumbersSchemaV3
} from '../../../../test-util/tools.ts';
import { AzureOpenAiChatClient } from './chat.ts';
import {
  isReasoningModel,
  isToolDefinitionLike,
  mapLangChainToAiClient,
  mapOutputToChatResult,
  mapToolToOpenAiFunction,
  mapToolToOpenAiTool
} from './util.ts';

import type { AzureOpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';
import type { AzureOpenAiCreateChatCompletionResponse } from '@sap-ai-sdk/foundation-models/internal.js';

import type { AzureOpenAiChatCallOptions } from './types.ts';
import type { BaseMessage } from '@langchain/core/messages';

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

    const myTool = tool(({ a, b }) => a + b, {
      name: 'test',
      description: 'Add two numbers',
      schema: addNumbersSchema
    });

    const request: AzureOpenAiChatCompletionParameters = {
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
            parameters: toJsonSchema(addNumbersSchema)
          }
        }
      ],
      tool_choice: 'auto',
      functions: [{ name: 'random' }, { name: 'test' }]
    };
    const client = new AzureOpenAiChatClient({ modelName: 'gpt-5.4-nano' });
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
    const client = new AzureOpenAiChatClient({ modelName: 'gpt-5.4-nano' });
    expect(() =>
      mapLangChainToAiClient(client, langchainPrompt, defaultOptions)
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported message type: remove]'
    );
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

    it('should map a structured tool with Zod V3 schema', async () => {
      const toolInput = {
        name: 'test',
        description: 'Some description',
        schema: addNumbersSchemaV3
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

    it('should map a structured tool with Zod V4 schema', async () => {
      const toolInput = {
        name: 'test',
        description: 'Some description',
        schema: addNumbersSchema
      };
      const expectedOutput = {
        name: 'test',
        description: 'Some description',
        parameters: {
          type: 'object',
          $schema: 'https://json-schema.org/draft/2020-12/schema',
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
  describe('isReasoningModel', () => {
    it('should identify reasoning models correctly', () => {
      expect(isReasoningModel('o1')).toBe(true);
      expect(isReasoningModel('o1-mini')).toBe(true);
      expect(isReasoningModel('o1-preview')).toBe(true);
      expect(isReasoningModel('o3')).toBe(true);
      expect(isReasoningModel('o3-mini')).toBe(true);
      expect(isReasoningModel('O1')).toBe(true);
      expect(isReasoningModel('gpt-5-mini')).toBe(true);
      expect(isReasoningModel('gpt-5.4-nano')).toBe(true);
    });

    it('should return false for non-reasoning models', () => {
      expect(isReasoningModel('gpt-4o')).toBe(false);
      expect(isReasoningModel('gpt-4o-mini')).toBe(false);
      expect(isReasoningModel('gpt-4')).toBe(false);
      expect(isReasoningModel('gpt-35-turbo')).toBe(false);
      expect(isReasoningModel('gpt-5-chat')).toBe(false);
      expect(isReasoningModel('')).toBe(false);
    });
  });

  describe('mapLangChainToAiClient token mapping (#1174)', () => {
    it('should map max_tokens to max_completion_tokens for reasoning models', () => {
      const client = new AzureOpenAiChatClient({
        modelName: 'o1',
        max_tokens: 500
      });
      const result = mapLangChainToAiClient(client, []);
      expect(result.max_completion_tokens).toBe(500);
      expect(result.max_tokens).toBeUndefined();
    });

    it('should map max_completion_tokens directly for reasoning models', () => {
      const client = new AzureOpenAiChatClient({
        modelName: 'o3-mini',
        max_completion_tokens: 300
      });
      const result = mapLangChainToAiClient(client, []);
      expect(result.max_completion_tokens).toBe(300);
      expect(result.max_tokens).toBeUndefined();
    });

    it('should support maxCompletionTokens alias for reasoning models', () => {
      const client = new AzureOpenAiChatClient({
        modelName: 'o1',
        maxCompletionTokens: 250
      });
      const result = mapLangChainToAiClient(client, []);
      expect(result.max_completion_tokens).toBe(250);
      expect(result.max_tokens).toBeUndefined();
    });

    it('should allow options to override max_completion_tokens at call time', () => {
      const client = new AzureOpenAiChatClient({
        modelName: 'o1',
        max_tokens: 500
      });
      const result = mapLangChainToAiClient(client, [], {
        ...defaultOptions,
        max_completion_tokens: 150
      });
      expect(result.max_completion_tokens).toBe(150);
    });

    it('should map max_tokens to max_tokens for standard models', () => {
      const client = new AzureOpenAiChatClient({
        modelName: 'gpt-4o',
        max_tokens: 1000
      });
      const result = mapLangChainToAiClient(client, []);
      expect(result.max_tokens).toBe(1000);
      expect(result.max_completion_tokens).toBeUndefined();
    });

    it('should map explicit max_completion_tokens for standard models when provided', () => {
      const client = new AzureOpenAiChatClient({
        modelName: 'gpt-4o',
        max_completion_tokens: 750
      });
      const result = mapLangChainToAiClient(client, []);
      expect(result.max_completion_tokens).toBe(750);
      expect(result.max_tokens).toBeUndefined();
    });
  });
});
