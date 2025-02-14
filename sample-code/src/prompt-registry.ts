import { PromptTemplatesApi } from '@sap-ai-sdk/prompt-registry';
import type { PromptTemplateDeleteResponse, PromptTemplatePostResponse } from '@sap-ai-sdk/prompt-registry';

/**
 * Create a prompt template.
 * @param name - The name of the prompt template.
 * @param scenario - The scenario of the prompt template.
 * @returns Prompt template post response.
 */
export async function createPromptTemplate(name: string, scenario: string): Promise<PromptTemplatePostResponse> {
  return PromptTemplatesApi.createUpdatePromptTemplate({
    name,
    scenario,
    version: '0.0.1',
    spec: {
      template: [
        {
          content: 'Hello, world!',
          role: 'user'
        }
      ]
    }
  }).execute();
}

/**
 * Delete prompt template by id.
 * @param id - The id of the prompt template.
 * @returns Prompt template delete response.
 */
export async function deletePromptTemplate(id: string): Promise<PromptTemplateDeleteResponse> {
  return PromptTemplatesApi.deletePromptTemplate(id).execute();
}
