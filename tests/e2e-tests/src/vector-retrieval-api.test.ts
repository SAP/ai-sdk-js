import {
  createCollection,
  createDocument,
  searchCollection,
  getCollection,
  deleteCollection
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';
import type { Collection, RetrievalSearchResults } from '@sap-ai-sdk/rage';

loadEnv();

describe('VectorApi and RetrievalApi', () => {
  let collectionId: string;
  beforeAll(async () => {
    const collection = await createCollection('test-collection', 'default');
    expect(collection).toBeDefined();
    expect(collection.id).toBeDefined();
    collectionId = collection.id;
  });

  it('should create a document in the collection and search it', async () => {
    const documentContent =
      'Joule is the AI copilot that truly understands your business. Joule revolutionizes how you interact with your SAP business systems, making every touchpoint count and every task simpler.';
    const document = await createDocument(
      collectionId,
      'default',
      documentContent
    );
    expect(document).toBeDefined();
    const searchResults: RetrievalSearchResults = await searchCollection(
      collectionId,
      'what is joule?',
      'default'
    );
    expect(searchResults).toBeDefined();
    expect(searchResults.results).toBeDefined();
    expect(searchResults.results.length).toBeGreaterThan(0);
    expect(searchResults.results[0]?.results[0]?.dataRepository?.id).toBe(
      collectionId
    );
    expect(
      searchResults.results[0]?.results[0]?.dataRepository?.documents[0]
        ?.chunks[0]?.content
    ).toContain('Joule is the AI copilot that truly understands your business');
  });

  afterAll(async () => {
    const collection: Collection = await getCollection(collectionId, 'default');
    expect(collection).toBeDefined();
    const response = await deleteCollection(collection.id, 'default');
    expect(response).toBeDefined();
  });
});
