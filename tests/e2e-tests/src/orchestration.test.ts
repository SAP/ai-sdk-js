import {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig,
  orchestrationCompletionMasking,
  orchestrationChatCompletionImage,
  chatCompletionStreamWithJsonModuleConfig,
  chatCompletionStream
} from '@sap-ai-sdk/sample-code';
import { orchestrationTemplateRepository } from '@sap-ai-sdk/sample-code/src/orchestration.js';
import { loadEnv } from './utils/load-env.js';
import type { OrchestrationResponse } from '@sap-ai-sdk/orchestration';

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
    const response = await orchestrationTemplateRepository();

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
    const result = await orchestrationCompletionMasking();
    expect(result).toEqual(expect.any(String));
  });

  it('should complete a chat with image', async () => {
    const response = await orchestrationChatCompletionImage();
    expect(response.getContent()?.includes('SAP')).toBe(true);
    expect(response.getContent()?.includes('logo')).toBe(true);
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
});
