import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import { OrchestrationStreamResponse } from '../index.js';
import { mergeStreamResponse, validateResponse } from './stream.js';
import type {
  CompletionPostResponseStreaming,
  OrchestrationStreamChunkResponse
} from '../index.js';

const llmBase = {
  id: 'orchestration-id-1',
  object: 'chat.completion.chunk',
  created: 1752575616,
  model: 'gpt-4o-2024-08-06',
  system_fingerprint: 'fp_ee1d74bde0',
  usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
};

describe('stream-util', () => {
  describe('mergeStreamResponse', () => {
    it('merges basic stream response properties', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: {
          ...llmBase,
          choices: [],
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
        }
      };

      mergeStreamResponse(response, chunk);

      expect(response._data.request_id).toBe('test-request-123');
      expect(response._data.orchestration_result).toBeDefined();
      expect(response._data.orchestration_result?.usage).toEqual({
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15
      });
    });

    it('merges module results with llm module', () => {
      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        module_results: {
          llm: {
            ...llmBase,
            usage: {
              prompt_tokens: 20,
              completion_tokens: 10,
              total_tokens: 30
            },
            choices: [
              {
                index: 0,
                delta: { content: 'Hello' }
              }
            ]
          }
        }
      };

      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();

      mergeStreamResponse(response, chunk);

      expect(response._data.module_results?.llm?.usage).toEqual({
        prompt_tokens: 20,
        completion_tokens: 10,
        total_tokens: 30
      });
      expect(response._data.module_results?.llm?.choices).toEqual([
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello'
          },
          finish_reason: ''
        }
      ]);
    });

    it('merges output_unmasking module results', () => {
      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        module_results: {
          output_unmasking: [
            {
              index: 0,
              delta: { content: 'Unmasked content' }
            }
          ]
        }
      };

      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();

      mergeStreamResponse(response, chunk);

      expect(response._data.module_results?.output_unmasking).toHaveLength(1);
      expect(
        response._data.module_results?.output_unmasking?.[0].message.content
      ).toBe('Unmasked content');
    });
  });

  describe('token usage merging', () => {
    it('merges token usage with existing values', () => {
      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          usage: { prompt_tokens: 15, completion_tokens: 8, total_tokens: 23 },
          choices: []
        }
      };

      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
          choices: []
        }
      };

      mergeStreamResponse(response, chunk);

      expect(response._data.orchestration_result?.usage).toEqual({
        prompt_tokens: 15,
        completion_tokens: 8,
        total_tokens: 23
      });
    });

    it('handles missing token usage gracefully', () => {
      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: []
        }
      };

      delete chunk.orchestration_result?.usage;

      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          choices: []
        }
      };

      mergeStreamResponse(response, chunk);

      expect(response._data.orchestration_result?.usage).toEqual({
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15
      });
    });
  });

  describe('choice merging', () => {
    it('merges content from multiple chunks', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hello'
              },
              finish_reason: '',
              logprobs: {
                content: [],
                refusal: []
              }
            }
          ]
        }
      };

      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              delta: { content: ' World' },
              finish_reason: 'stop'
            }
          ]
        }
      };

      mergeStreamResponse(response, chunk);

      expect(
        response._data.orchestration_result?.choices[0].message.content
      ).toBe('Hello World');
      expect(
        response._data.orchestration_result?.choices[0].finish_reason
      ).toBe('stop');
    });

    it('adds new choice when index does not exist', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'First choice'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };

      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 1,
              delta: { content: 'Second choice' },
              finish_reason: 'stop'
            }
          ]
        }
      };

      mergeStreamResponse(response, chunk);

      expect(response._data.orchestration_result?.choices).toHaveLength(2);
      expect(
        response._data.orchestration_result?.choices[1].message.content
      ).toBe('Second choice');
    });

    it('handles finish reasons correctly', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Test'
              },
              finish_reason: ''
            }
          ]
        }
      };

      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              delta: { content: '' },
              finish_reason: 'content_filter'
            }
          ]
        }
      };

      mergeStreamResponse(response, chunk);

      expect(
        response._data.orchestration_result?.choices[0].finish_reason
      ).toBe('content_filter');
    });
  });

  describe('tool call merging', () => {
    it('merges tool call arguments from multiple chunks', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: '',
                tool_calls: [
                  {
                    index: 0,
                    id: 'tool-call-1',
                    type: 'function',
                    function: {
                      name: 'test_function',
                      arguments: '{"param1":'
                    }
                  }
                ]
              },
              finish_reason: ''
            }
          ]
        }
      };

      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              delta: {
                content: '',
                tool_calls: [
                  {
                    index: 0,
                    id: 'tool-call-1',
                    type: 'function',
                    function: {
                      name: 'test_function',
                      arguments: '"value1"}'
                    }
                  }
                ]
              }
            }
          ]
        }
      };

      mergeStreamResponse(response, chunk);

      expect(
        response._data.orchestration_result?.choices[0].message.tool_calls?.[0]
          .function.arguments
      ).toBe('{"param1":"value1"}');
    });

    it('adds new tool call when index does not exist', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: '',
                tool_calls: [
                  {
                    index: 0,
                    id: 'tool-call-1',
                    type: 'function',
                    function: {
                      name: 'first_function',
                      arguments: '{"param1":"value1"}'
                    }
                  }
                ]
              },
              finish_reason: ''
            }
          ]
        }
      };

      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              delta: {
                content: '',
                tool_calls: [
                  {
                    index: 1,
                    id: 'tool-call-2',
                    type: 'function',
                    function: {
                      name: 'second_function',
                      arguments: '{"param2":"value2"}'
                    }
                  }
                ]
              }
            }
          ]
        }
      };

      mergeStreamResponse(response, chunk);

      expect(
        response._data.orchestration_result?.choices[0].message.tool_calls
      ).toHaveLength(2);
      expect(
        response._data.orchestration_result?.choices[0].message.tool_calls?.[1]
          .function.name
      ).toBe('second_function');
    });
  });

  describe('logprobs merging', () => {
    it('merges logprobs content arrays', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Test'
              },
              finish_reason: '',
              logprobs: {
                content: [{ token: 'Test', logprob: -0.1 }]
              }
            }
          ]
        }
      };

      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              delta: { content: ' message' },
              logprobs: {
                content: [{ token: ' message', logprob: -0.2 }]
              }
            }
          ]
        }
      };

      mergeStreamResponse(response, chunk);

      expect(
        response._data.orchestration_result?.choices[0]?.logprobs?.content
      ).toHaveLength(2);
      expect(
        response._data.orchestration_result?.choices?.[0]?.logprobs
          ?.content?.[1]?.token ?? ''
      ).toBe(' message');
    });

    it('handles missing logprobs gracefully', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Test'
              },
              finish_reason: ''
            }
          ]
        }
      };

      const chunk: CompletionPostResponseStreaming = {
        request_id: 'test-request-123',
        orchestration_result: {
          ...llmBase,
          choices: [
            {
              index: 0,
              delta: { content: ' message' },
              logprobs: {
                content: [{ token: ' message', logprob: -0.2 }]
              }
            }
          ]
        }
      };

      mergeStreamResponse(response, chunk);

      expect(
        response._data.orchestration_result?.choices[0].logprobs?.content
      ).toHaveLength(1);
      expect(
        response._data.orchestration_result?.choices[0].logprobs?.content?.[0]
          ?.token ?? ''
      ).toBe(' message');
    });
  });

  describe('validateResponse', () => {
    it('throws error when stream is still open', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: undefined
      };

      expect(() => validateResponse(response)).toThrow(
        "Stream wasn't closed properly. Please ensure the stream is closed after processing."
      );
    });

    it('validates successfully with proper response structure', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        module_results: {
          llm: {
            ...llmBase,
            usage: {
              prompt_tokens: 10,
              completion_tokens: 5,
              total_tokens: 15
            },
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: 'Test message'
                },
                finish_reason: 'stop'
              }
            ]
          }
        },
        orchestration_result: {
          ...llmBase,
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Test message'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };

      response._openStream = false;

      expect(() => validateResponse(response)).not.toThrow();
    });

    it('validates tool calls with proper JSON arguments', () => {
      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: {
          ...llmBase,
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: '',
                tool_calls: [
                  {
                    index: 0,
                    id: 'tool-call-1',
                    type: 'function',
                    function: {
                      name: 'test_function',
                      arguments: '{"param1":"value1"}'
                    }
                  }
                ]
              },
              finish_reason: 'tool_calls'
            }
          ]
        }
      };

      response._openStream = false;

      expect(() => validateResponse(response)).not.toThrow();
    });

    it('logs warning for invalid tool call arguments', () => {
      const logger = createLogger({
        package: 'orchestration',
        messageContext: 'stream-util'
      });
      const warnSpy = jest.spyOn(logger, 'warn');

      const response =
        new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();
      response._data = {
        request_id: 'test-request-123',
        module_results: {},
        orchestration_result: {
          ...llmBase,
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: '',
                tool_calls: [
                  {
                    index: 0,
                    id: 'tool-call-1',
                    type: 'function',
                    function: {
                      name: 'test_function',
                      arguments: '{"param1":invalid_json}'
                    }
                  }
                ]
              },
              finish_reason: 'tool_calls'
            }
          ]
        }
      };

      response._openStream = false;

      validateResponse(response);

      expect(warnSpy).toHaveBeenCalledWith(
        'orchestration: LlmChoice 0: ToolCall arguments are not valid JSON for tool: test_function'
      );
    });
  });
});
