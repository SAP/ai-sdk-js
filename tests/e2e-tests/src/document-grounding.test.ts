import {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  orchestrationGroundingHelpSapCom,
  orchestrationGroundingVector
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('document grounding', () => {
  let collectionId: string;
  let timestamp: number;

  beforeAll(async () => {
    collectionId = await createCollection();
    timestamp = Date.now();
    await createDocumentsWithTimestamp(collectionId, timestamp);
  });

  afterAll(async () => {
    await deleteCollection(collectionId);
  });

  it('should get the result based on grounding context from vector data repository via orchestration API', async () => {
    const result = await orchestrationGroundingVector();
    expect(result.getContent()).toEqual(timestamp.toString());
  });

  it('should get the result based on grounding context from `help.sap.com` data respository via orchestration API', async () => {
    const result = await orchestrationGroundingHelpSapCom();
    expect(result.getContent()).toEqual(expect.any(String));
    expect(result.data.module_results).toBeDefined();
    expect(result.data.module_results.grounding!.data).toBeDefined();
  });
});
