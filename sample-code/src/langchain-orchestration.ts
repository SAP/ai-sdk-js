import { StringOutputParser } from '@langchain/core/output_parsers';
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import { buildAzureContentSafetyFilter, buildLlamaGuardFilter, type OrchestrationModuleConfig } from '@sap-ai-sdk/orchestration';

/**
 * Ask GPT about an introduction to SAP Cloud SDK.
 * @returns The answer from ChatGPT.
 */
export async function invokeChain(): Promise<string> {
  const orchestrationConfig: OrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o',
    },
    // define the template
    templating: {
      template: [
        {
          role: 'user',
          content: 'Tell me about {{?topic}}'
        }
      ]
    }
  };

  return new OrchestrationClient(orchestrationConfig)
    .pipe(new StringOutputParser())
    .invoke('My Message History', {
      inputParams: {
        topic: 'SAP Cloud SDK'
      }
    });
}

/**
 * Trigger input content filter.
 * @returns The answer from ChatGPT.
 */
export async function invokeChainWithInputFilter(): Promise<string> {
  const orchestrationConfig: OrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    // define the template
    templating: {
      template: [
        {
          role: 'user',
          content: 'Tell me about {{?topic}}'
        }
      ]
    },
    filtering: {
      input: {
        filters: [buildLlamaGuardFilter('self_harm')]
      }
    }
  };

  return new OrchestrationClient(orchestrationConfig)
    .pipe(new StringOutputParser())
    .invoke('My Message History', {
      inputParams: {
        topic: 'the way to hurt myself'
      }
    });
}

/**
 * Trigger output content filter.
 * @returns The answer from ChatGPT.
 */
export async function invokeChainWithOutputFilter(): Promise<string> {
  const orchestrationConfig: OrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    // define the template
    templating: {
      template: [
        {
          role: 'user',
          content: 'Tell me about {{?topic}}'
        }
      ]
    },
    filtering: {
      output: {
        filters: [buildAzureContentSafetyFilter({
          Hate: 'ALLOW_SAFE'
        })]
      }
    }
  };

  return new OrchestrationClient(orchestrationConfig)
    .pipe(new StringOutputParser())
    .invoke('My Message History', {
      inputParams: {
        topic: '30 different ways to rephrase "I hate you!" with strong feelings'
      }
    });
}
