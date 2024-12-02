import {
  createCollection,
  createDocumentsWithSecret,
  deleteCollection,
  orchestrationGrounding
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('document grounding', () => {
  let collectionId: string;
  let secret: number;

  beforeAll(async () => {
    collectionId = await createCollection();
    secret = Math.random();
    await createDocumentsWithSecret(collectionId, secret);
  });

  afterAll(async () => {
    await deleteCollection(collectionId);
  });

  it('should get the grounding secret via orchestration API', async () => {
    const result = await orchestrationGrounding();
    expect(result.getContent()).toEqual(secret.toString());
  });
});
