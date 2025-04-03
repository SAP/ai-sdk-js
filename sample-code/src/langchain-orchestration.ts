import { StringOutputParser } from '@langchain/core/output_parsers';
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import {
  buildAzureContentSafetyFilter,
  buildLlamaGuardFilter,
  type OrchestrationModuleConfig
} from '@sap-ai-sdk/orchestration';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';
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
 * Invoke the model with memory.
 * @returns The answer from ChatGPT.
 */
export async function invokeLangGraphChain(): Promise<string> {
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
    const response = await llm.invoke(state.messages, { inputParams: { message: inputParamMessage } });
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
      content: 'SAP Cloud SDK',
    }
  ];
  const output = await app.invoke({ messages: input }, config);

  const input2 = [
    {
      role: 'user',
      content: 'What is special about it?',
    },
  ];
  const output2 = await app.invoke({ messages: input2 }, config);

  return `${JSON.stringify(output.messages.at(-1)!.content)} \n\n\n ${JSON.stringify(output2.messages.at(-1)!.content)}`;
}
