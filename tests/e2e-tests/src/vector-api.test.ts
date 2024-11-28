import { createDocument, createCollection } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('VectorApi and RetrievalApi', () => {
  let collectionId: string;
  beforeAll(async () => {
    const collection = await createCollection('test-collection', 'default');
    expect(collection).toBeDefined();
    expect(collection.id).toBeDefined();
    collectionId = collection.id;
  });

  it('should create a document in the collection', async () => {
    const documentContent =
      'Joule is the AI copilot that truly understands your business. Joule revolutionizes how you interact with your SAP business systems, making every touchpoint count and every task simpler.';
    const document = await createDocument(
      collectionId,
      'default',
      documentContent
    );
    expect(document).toBeDefined();
  });
});
