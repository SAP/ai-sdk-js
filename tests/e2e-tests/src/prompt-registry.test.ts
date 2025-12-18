import {
  createPromptTemplate,
  deletePromptTemplate
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('prompt registry', () => {
  it('should create a prompt template and then delete', async () => {
    const { id } = await createPromptTemplate(
      'ai-sdk-js-test-custom-resource-group-prompt-template',
      'orchestration'
    );
    expect(id.length).toEqual(36);

    const { message } = await deletePromptTemplate(id);
    expect(message).toEqual('Prompt deleted successfully.');
  });
});
