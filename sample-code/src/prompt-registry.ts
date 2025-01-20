import { DefaultApi, PromptTemplateGetResponse } from '@sap-ai-sdk/prompt-registry';
/**
 * Create a template.
 * @returns Prompt Template creation response.
 */
export async function createPromptTemplate(): Promise<string> {
  const promptTemplatePostResponse = await DefaultApi
    .registryControllerPromptControllerCreateUpdatePromptTemplate({
      name: 'get-capital', 
      version: '0.0.1',
      scenario: 'e2e-test',
      spec: {
        template: [{ role: 'user', content: 'What is the capital of {{?input}}' }],
        defaults: { input: 'Germany' },
      }
    })
    .execute();

  return promptTemplatePostResponse.id;
}

/**
 * Get all prompt templates.
 * @returns 
 */
export async function getAllPromptTemplates(): Promise<PromptTemplateGetResponse[]> {
  const promptTemplateListResponse = await DefaultApi
  .registryControllerPromptControllerListPromptTemplates()
  .execute();

  return promptTemplateListResponse.resources;
}