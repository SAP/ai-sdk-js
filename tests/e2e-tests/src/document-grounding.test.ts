import {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  orchestrationGrounding
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

  it('should get the grounding secret via orchestration API', async () => {
    const result = await orchestrationGrounding();
    expect(result.getContent()).toEqual(timestamp.toString());
  });
});
