import {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  getPipelineStatus,
  orchestrationGrounding
} from '@sap-ai-sdk/sample-code';

import { loadEnv } from './utils/load-env.ts';

loadEnv();

describe('document grounding', () => {
  it('should get the result based on grounding context from vector data repository via orchestration API', async () => {
    const collectionId = await createCollection();
    const timestamp = Date.now();
    await createDocumentsWithTimestamp(collectionId, timestamp);
    try {
      const result = await orchestrationGrounding(
        'When was the last time SAP AI SDK JavaScript end to end test was executed? Return only the latest timestamp in milliseconds without any other text.'
      );
      expect(result.getContent()).toEqual(timestamp.toString());
    } finally {
      await deleteCollection(collectionId);
    }
  });

  it('should get the result based on grounding context from `help.sap.com` data respository via orchestration API', async () => {
    const result = await orchestrationGrounding(
      'Give me a short introduction of SAP AI Core.',
      'help.sap.com'
    );
    expect(result.getContent()).toEqual(expect.any(String));
    expect(result.getIntermediateResults()).toBeDefined();
    expect(result.getIntermediateResults().grounding!.data).toBeDefined();
  });

  it('should get the result based on grounding context from SharePoint data respository via orchestration API', async () => {
    const result = await orchestrationGrounding(
      [
        'Read the document and copy its unique test phrase exactly, including punctuation.',
        'Example 1: Document says "Test phrase: blue-orbit-19". Answer: blue-orbit-19',
        'Example 2: Document says "Test phrase: !sample_42?". Answer: !sample_42?',
        'What is the unique test phrase in the provided context?',
        'Reply only with the phrase, or NOT_FOUND if absent.'
      ].join('\n\n'),
      'vector',
      ['758658dc-3df6-4ab9-9de3-b55caf3b2293']
    );
    // Document extraction can insert whitespace into the synthetic fixture.
    expect(result.getContent()?.replace(/\s/g, '')).toContain(
      '&)UPnkL_izT)&1u%?2Kg*Y.@qFqR@/'
    );
    expect(result.getIntermediateResults()).toBeDefined();
    expect(result.getIntermediateResults().grounding!.data).toBeDefined();
  });

  it('should get the result based on grounding context from S3 data respository via orchestration API', async () => {
    const result = await orchestrationGrounding(
      "What is the Tom's favorite snack?",
      'vector',
      ['9caa9720-72cf-489c-9f87-cfbf323e9e0d']
    );
    expect(result.getContent()).toContain('Dubai Chocolate');
    expect(result.getIntermediateResults()).toBeDefined();
    expect(result.getIntermediateResults().grounding!.data).toBeDefined();
  });

  it('should get the pipeline status', async () => {
    const pipelineStatus = await getPipelineStatus(
      'f8e35d29-2fc8-428c-ae70-8260fbdff0d7'
    );
    expect(pipelineStatus.status).toStrictEqual('FINISHED');
  });
});
