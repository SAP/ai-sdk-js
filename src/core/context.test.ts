import {
  mockAiCoreEnvVariable,
  mockClientCredentialsGrantCall
} from '../../test-util/mock-context.js';
import { getAiCoreDestination } from './context';

describe('context', () => {
  it('should throw if ai-core binding is not found', async () => {
    await expect(getAiCoreDestination()).rejects.toThrow(
      'Could not find service credentials for AI Core. Please check the service binding.'
    );
  });

  it('should throw for ill formatted JSON', async () => {
    process.env.aicore = 'Improper JSON string';

    await expect(getAiCoreDestination()).rejects
      .toThrowErrorMatchingInlineSnapshot(`
     "Error in parsing service key from the "aicore" environment variable.
     Cause: Unexpected token 'I', "Improper JSON string" is not valid JSON"
    `);
  });

  it('should throw if client credentials are not fetched', async () => {
    mockAiCoreEnvVariable();
    mockClientCredentialsGrantCall(
      {
        error: 'unauthorized',
        error_description: 'Bad credentials'
      },
      401
    );
    await expect(getAiCoreDestination()).rejects.toThrow(
      /Could not fetch client credentials token for service of type "aicore"/
    );
  });
});
