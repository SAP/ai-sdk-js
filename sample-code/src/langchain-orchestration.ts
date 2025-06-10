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
import { tool } from '@langchain/core/tools';
import {
  HumanMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import z from 'zod';
import type { BaseMessage, AIMessageChunk } from '@langchain/core/messages';
import type { LangChainOrchestrationModuleConfig } from '@sap-ai-sdk/langchain';

/**
 * Ask GPT about an introduction to SAP Cloud SDK.
 * @returns The answer from ChatGPT.
 */
export async function invokeChain(): Promise<string> {
  const orchestrationConfig: LangChainOrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    }
  };

  return new OrchestrationClient(orchestrationConfig)
    .pipe(new StringOutputParser())
    .invoke([
      {
        role: 'user',
        content: 'Tell me about {{?topic}}'
      }
    ], {
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
  const orchestrationConfig: LangChainOrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    },
    filtering: {
      input: {
        filters: [buildLlamaGuardFilter('self_harm')]
      }
    }
  };

  return new OrchestrationClient(orchestrationConfig)
    .pipe(new StringOutputParser())
    .invoke([
      {
        role: 'user',
        content: 'Tell me about {{?topic}}'
      }
    ], {
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
  const orchestrationConfig: LangChainOrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
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
    .invoke([
        {
          role: 'user',
          content: 'Tell me about {{?topic}}'
        }
      ], {
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
  const orchestrationConfig: LangChainOrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
    }
  };

  const llm = new OrchestrationClient(orchestrationConfig);
  // Define the function that calls the model
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
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
 * Stream responses using LangChain Orchestration client.
 * @param controller - The abort controller to cancel the request if needed.
 * @returns An async iterable of {@link AIMessageChunk} objects.
 */
export async function streamChain(
  controller = new AbortController()
): Promise<AsyncIterable<AIMessageChunk>> {
  const orchestrationConfig: LangChainOrchestrationModuleConfig = {
    llm: {
      model_name: 'gpt-4o'
    }
  };

  const client = new OrchestrationClient(orchestrationConfig);
  return client.stream(
    [
      {
        role: 'user',
        content:
          'Write a 100 word explanation about SAP Cloud SDK and its capabilities'
      }
    ],
    {
      signal: controller.signal
    }
  );
}

/**
 * Trigger masking the input provided to the large language model.
 * @returns The answer from ChatGPT.
 */
export async function invokeChainWithMasking(): Promise<string> {
  const orchestrationConfig: LangChainOrchestrationModuleConfig = {
    // define the language model to be used
    llm: {
      model_name: 'gpt-4o'
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
    .invoke([
      {
          role: 'user',
          content: 'Summarize the following CV in 10 sentences: {{?orgCV}}'
        }
    ], {
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

/**
 * Let GPT increase the shareholder value.
 * @returns The answer from GPT.
 */
export async function invokeToolChain(): Promise<string> {
  // initialize client with options
  const client = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4o'
    }
  });

  // create a function to increase the shareholder value
  function shareholderValueFunction(value: number): string {
    return `The shareholder value has been increased to ${value * 2}`;
  }

  // create a tool
  const shareholderValueTool = tool(shareholderValueFunction, {
    name: 'shareholder_value',
    description: 'Multiplies the shareholder value',
    schema: z.object({
      value: z.number().describe('The value that is supposed to be increased.')
    })
  });

  const messages: BaseMessage[] = [
    new HumanMessage('Increase the shareholder value, it is currently at 10')
  ];

  const response = await client
    .bindTools([shareholderValueTool])
    .invoke(messages);

  messages.push(response);

  if (
    Array.isArray(response.tool_calls) &&
    response.tool_calls[0].name === 'shareholder_value'
  ) {
    const shareholderValue = shareholderValueFunction(
      response.tool_calls[0].args.value
    );

    const toolMessage = new ToolMessage({
      content: shareholderValue,
      tool_call_id: response.tool_calls[0].id ?? 'default'
    });

    messages.push(toolMessage);
  } else {
    const failMessage = new SystemMessage('No tool calls were made');
    messages.push(failMessage);
  }

  const finalResponse = await client.invoke(messages);

  // create an output parser
  const parser = new StringOutputParser();

  // parse the response
  return parser.invoke(finalResponse);
}
