import {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationPromptRegistry,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig,
  orchestrationCompletionMasking,
  orchestrationMaskGroundingInput,
  orchestrationChatCompletionImage,
  chatCompletionStreamWithJsonModuleConfig,
  chatCompletionStream,
  orchestrationResponseFormat,
  orchestrationMessageHistoryWithToolCalling
} from '@sap-ai-sdk/sample-code';
import {
  OrchestrationClient,
  type OrchestrationModuleConfig,
  type OrchestrationResponse
} from '@sap-ai-sdk/orchestration';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('orchestration', () => {
  const assertContent = (response: OrchestrationResponse) => {
    expect(response.data.module_results).toBeDefined();
    expect(response.data.module_results.templating).not.toHaveLength(0);
    expect(response.data.orchestration_result.choices).not.toHaveLength(0);
    expect(response.getContent()).toEqual(expect.any(String));
    expect(response.getFinishReason()).toEqual('stop');
  };

  it('should complete a chat', async () => {
    const response = await orchestrationChatCompletion();

    assertContent(response);
  });

  it('should complete a chat with a template', async () => {
    const response = await orchestrationTemplating();

    assertContent(response);
  });

  it('should complete a chat with a template reference', async () => {
    const response = await orchestrationPromptRegistry();

    assertContent(response);
  });

  it('should trigger an input filter', async () => {
    await orchestrationInputFiltering();
  });

  it('should trigger an output filter', async () => {
    const response = await orchestrationOutputFiltering();

    expect(response.data.module_results).toBeDefined();
    expect(response.data.module_results.output_filtering!.data).toBeDefined();
    expect(response.getContent).toThrow(Error);
    expect(response.getFinishReason()).toEqual('content_filter');
  });

  it('should allow for custom request parameters', async () => {
    const response = await orchestrationRequestConfig();

    assertContent(response);
  });

  it('should complete a chat with masking', async () => {
    const response = await orchestrationCompletionMasking();
    expect(response).toEqual(expect.any(String));
  });

  it('should complete a chat with masked grounding input', async () => {
    const response = await orchestrationMaskGroundingInput();
    const parsedGroundingInput = JSON.parse(
      response.data.module_results.input_masking!.data!.masked_grounding_input
    )[0];
    expect(parsedGroundingInput).toEqual(
      "What is MASKED_ORG_1's product Joule?"
    );
    assertContent(response);
  });

  it('should complete a chat with image', async () => {
    const response = await orchestrationChatCompletionImage();
    expect(response.getContent()?.includes('SAP')).toBe(true);
    expect(response.getContent()?.includes('logo')).toBe(true);
  });

  it('should complete a chat with a required response format', async () => {
    const result = await orchestrationResponseFormat();
    expect(result.language).toBeDefined();
    expect(result.translation).toBeDefined();
  });

  it('should complete a chat when message history with tool calls is passed', async () => {
    const chatCompletionResult =
      await orchestrationMessageHistoryWithToolCalling();
    assertContent(chatCompletionResult);
  });

  it('should return stream of orchestration responses', async () => {
    const response = await chatCompletionStream(new AbortController());

    for await (const chunk of response.stream) {
      expect(chunk).toBeDefined();
    }
    expect(response.getFinishReason()).toEqual('stop');
    expect(response.getTokenUsage()).toBeDefined();
  });

  it('should return stream of orchestration responses, using a JSON client', async () => {
    const response = await chatCompletionStreamWithJsonModuleConfig(
      new AbortController()
    );

    for await (const chunk of response.stream) {
      expect(chunk).toBeDefined();
    }
    expect(response.getFinishReason()).toEqual('stop');
    expect(response.getTokenUsage()).toBeDefined();
  });

  it('should return error message when incorrect templating is provided on orchestration stream call', async () => {
    const config: OrchestrationModuleConfig = {
      llm: {
        model_name: 'gpt-4o',
        model_params: {}
      },
      templating: {
        template: [
          {
            role: 'user',
            content: 'Give me a short introduction on {{ ?__input__ }}.'
          }
        ]
      }
    };

    try {
      await new OrchestrationClient(config).stream(
        {
          inputParams: { __input__: 'SAP Cloud SDK' }
        },
        new AbortController()
      );
    } catch (err: any) {
      expect(err.stack).toContain(
        'Caused by:\nHTTP Response: Request failed with status code 400'
      );
      expect(err.cause?.response?.data.message).toBeDefined();
    }
  });
});
