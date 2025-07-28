export const prompt_registry = {
  output: {
    client: 'zod',
    mode: 'single',
    target: './src/zod/prompt-registry.zod.ts'
  },
  input: {
    target: './src/spec/prompt-registry.yaml',
    validation: false,
    filters: {
      mode: 'include',
      schemas: ['PromptTemplatePostRequest']
    }
  }
};
