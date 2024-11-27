import {
  createCollection,
  getCollection,
  deleteCollection
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';
import type { VectorApi } from '@sap-ai-sdk/rage';

loadEnv();

describe('VectorApi', () => {
  let collectionId: string;

  beforeAll(async () => {
    const collection = await createCollection('test-collection', 'default');
    expect(collection).toBeDefined();
    expect(collection.id).toBeDefined();
    collectionId = collection.id;
  });

  it('should delete test-collection if it exists', async () => {
    const collection: VectorApi.Collection = await getCollection(
      collectionId,
      'default'
    );
    expect(collection).toBeDefined();
    const response = await deleteCollection(collection.id, 'default');
    expect(response).toBeDefined();
  });
});
