import { StringOutputParser } from '@langchain/core/output_parsers';
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import {
  buildAzureContentSafetyFilter,
  buildDpiMaskingProvider,
  buildLlamaGuardFilter,
  type OrchestrationModuleConfig
} from '@sap-ai-sdk/orchestration';

/**
 * Ask GPT about an introduction to SAP Cloud SDK.
 * @returns The answer from ChatGPT.
 */
export async function invokeChain(): Promise<string> {
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
        filters: [
          buildAzureContentSafetyFilter({
            Hate: 'ALLOW_SAFE'
          })
        ]
      }
    }
  };

  return new OrchestrationClient(orchestrationConfig)
    .pipe(new StringOutputParser())
    .invoke('My Message History', {
      inputParams: {
        topic:
          '30 different ways to rephrase "I hate you!" with strong feelings'
      }
    });
}

/**
 * Trigger masking the input provided to the large language model.
 * @returns The answer from ChatGPT.
 */
export async function invokeChainWithMasking(): Promise<string> {
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
          content: 'Summarize the following CV in 10 sentences: {{?orgCV}}'
        }
      ]
    },
    masking: {
      masking_providers: [
        buildDpiMaskingProvider({
          method: 'pseudonymization',
          entities: [
            'profile-email',
            'profile-person',
            'profile-org',
            'profile-phone',
            'profile-location'
          ],
          allowlist: ['Harvard University', 'Boston']
        })
      ]
    }
  };

  return new OrchestrationClient(orchestrationConfig)
    .pipe(new StringOutputParser())
    .invoke('My Message History', {
      inputParams: {
        orgCV:
          'Patrick Morgan \n' +
          '+49 (970) 333-3833 \n' +
          'patric.morgan@hotmail.com \n\n' +
          'Highlights \n' +
          '- Strategic and financial planning expert \n' +
          '- Accurate forecasting \n' +
          '- Proficient in SAP, Excel VBA\n\n' +
          'Education \n' +
          'Master of Science: Finance - 2014 \n' +
          'Harvard University, Boston \n\n' +
          'Bachelor of Science: Finance - 2011 \n' +
          'Harvard University, Boston \n\n\n' +
          'Certifications \n' +
          'Certified Management Accountant \n\n\n' +
          'Summary \n' +
          'Skilled Financial Manager adept at increasing work process efficiency and profitability through functional and technical analysis. Successful at advising large corporations, small businesses, and individual clients. Areas of expertise include asset allocation, investment strategy, and risk management. \n\n\n' +
          'Experience \n' +
          'Finance Manager - 09/2016 to 05/2018 \n' +
          'M&K Group, York \n' +
          '- Manage the modelling, planning, and execution of all financial processes. \n' +
          '- Carry short and long-term custom comprehensive financial strategies to reach company goals. \n' +
          'Finance Manager - 09/2013 to 05/2016 \n' +
          'Ago Group, Chicago \n' +
          '- Drafted executive analysis reports highlighting business issues, potential risks, and profit opportunities. \n' +
          '- Recommended innovative alternatives to generate revenue and reduce unnecessary costs. \n'
      }
    });
}
