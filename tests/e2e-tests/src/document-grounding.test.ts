import {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  getPipelineStatus,
  orchestrationGrounding
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('document grounding', () => {
  it('should get the result based on grounding context from vector data repository via orchestration API', async () => {
    const collectionId = await createCollection();
    const timestamp = Date.now();
    await createDocumentsWithTimestamp(collectionId, timestamp);
    const result = await orchestrationGrounding(
      'When was the last time SAP AI SDK JavaScript end to end test was executed? Return only the latest timestamp in milliseconds without any other text.'
    );
    expect(result.getContent()).toEqual(timestamp.toString());
    await deleteCollection(collectionId);
  });

  it('should get the result based on grounding context from `help.sap.com` data respository via orchestration API', async () => {
    const result = await orchestrationGrounding(
      'Give me a short introduction of SAP AI Core.',
      'help.sap.com'
    );
    expect(result.getContent()).toEqual(expect.any(String));
    expect(result.data.module_results).toBeDefined();
    expect(result.data.module_results.grounding!.data).toBeDefined();
  });

  it('should get the result based on grounding context from SharePoint data respository via orchestration API', async () => {
    const result = await orchestrationGrounding(
      'What is the AI SDK e2e random string?',
      'vector',
      ['0bd2adc2-8d0d-478a-94f6-a0c10958f602']
    );
    expect(result.getContent()).toContain('&)UPnkL_izT)&1u%?2Kg*Y.@qFqR@/');
    expect(result.data.module_results).toBeDefined();
    expect(result.data.module_results.grounding!.data).toBeDefined();
  });

  it('should get the result based on grounding context from SharePoint data respository via orchestration API', async () => {
    const result = await orchestrationGrounding(
      "What is the Tom's favorite snack?",
      'vector',
      ['635e0628-91d6-4c20-8fb6-c24e08b6c31f']
    );
    expect(result.getContent()).toContain('Dubai Chocolate');
    expect(result.data.module_results).toBeDefined();
    expect(result.data.module_results.grounding!.data).toBeDefined();
  });

  it('should get the pipeline status', async () => {
    const pipelineStatus = await getPipelineStatus(
      '7b17e2ab-4ecc-448e-837f-2c10c9359925'
    );
    expect(pipelineStatus.status).toStrictEqual('INPROGRESS');
  });
});
