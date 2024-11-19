import { createCollection } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('VectorApi', () => {
  it('should create a new collection', async () => {
    const collection = await createCollection('default', 'test-collection');
    expect(collection).toBeDefined();
  });
});
