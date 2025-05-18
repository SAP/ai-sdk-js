import { StringOutputParser } from '@langchain/core/output_parsers';
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import {
  buildAzureContentSafetyFilter,
  buildDpiMaskingProvider,
  buildLlamaGuardFilter
} from '@sap-ai-sdk/orchestration';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver
} from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { LangchainOrchestrationModuleConfig } from '@sap-ai-sdk/langchain';

/**
 * Ask GPT about an introduction to SAP Cloud SDK.
 * @returns The answer from ChatGPT.
 */
export async function invokeChain(): Promise<string> {
  const orchestrationConfig: LangchainOrchestrationModuleConfig = {
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
  const orchestrationConfig: LangchainOrchestrationModuleConfig = {
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
  const orchestrationConfig: LangchainOrchestrationModuleConfig = {
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
 * Invoke the model with memory.
 * @returns The answer from ChatGPT.
 */
export async function invokeLangGraphChain(): Promise<string> {
  const orchestrationConfig: LangchainOrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    // define the template
    templating: {
      template: [
        {
          role: 'user',
          content: '{{?message}}'
        }
      ]
    }
  };

  const llm = new OrchestrationClient(orchestrationConfig);
  // Define the function that calls the model
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const latestMessage = state.messages.pop();
    const inputParamMessage = latestMessage!.content as string;
    const response = await llm.invoke(state.messages, {
      inputParams: { message: inputParamMessage }
    });
    // Update message history with response:
    return { messages: response };
  };

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    // Define the (single) node in the graph
    .addNode('model', callModel)
    .addEdge(START, 'model')
    .addEdge('model', END);

  // Add memory
  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  const config = { configurable: { thread_id: uuidv4() } };
  const input = [
    {
      role: 'user',
      content: 'Tell me something about the SAP Cloud SDK'
    }
  ];
  const output = await app.invoke({ messages: input }, config);

  const input2 = [
    {
      role: 'user',
      content: 'What is special about it? Tell me in 3 sentences!'
    }
  ];
  const output2 = await app.invoke({ messages: input2 }, config);

  const firstResponse = output.messages.at(-1)!.content as string;
  const secondResponse = output2.messages.at(-1)!.content as string;

  return `${firstResponse}\n\n${secondResponse}`;
}

/**
 * Stream responses from the OrchestrationClient using LangChain.
 * @param controller - The abort controller to cancel the request if needed.
 * @returns An async iterable of AIMessageChunk objects.
 */
export async function streamOrchestrationLangChain(
  controller = new AbortController()
): Promise<AsyncIterable<AIMessageChunk>> {
  // Todo Remove template and use messages after: https://github.com/SAP/ai-sdk-js-backlog/issues/293
  const orchestrationConfig: LangchainOrchestrationModuleConfig = {
    llm: {
      model_name: 'gpt-4o'
    },
    templating: {
      template: [
        {
          role: 'user',
          content: 'Write a 100 word explanation about {{?topic}}'
        }
      ]
    }
  };

  const client = new OrchestrationClient(orchestrationConfig);
  return client.stream([], {
    inputParams: {
      topic: 'SAP Cloud SDK and its capabilities'
    },
    signal: controller.signal
  });
}

/**
 * Trigger masking the input provided to the large language model.
 * @returns The answer from ChatGPT.
 */
export async function invokeChainWithMasking(): Promise<string> {
  const orchestrationConfig: LangchainOrchestrationModuleConfig = {
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
          method: 'anonymization',
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
          'patric.morgan@example.com \n\n' +
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
