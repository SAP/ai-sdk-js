import { StateGraph, MessagesAnnotation, MemorySaver, START, END, interrupt, Command } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const mockWeatherData: Record<string, { temperature: string; condition: string }> = {
  paris: { temperature: '22°C', condition: 'Mild and pleasant' },
  reykjavik: { temperature: '3°C', condition: 'Cold and windy' }
};

const mockRestaurantData: Record<string, string[]> = {
  paris: ['Le Comptoir du Relais', "L'As du Fallafel", 'Breizh Café'],
  reykjavik: ['Dill Restaurant', 'Fish Market', 'Grillmarkaðurinn']
};

const getWeatherTool = tool(
  async ({ city }) => {
    const weather = mockWeatherData[city.toLowerCase()];
    return weather
      ? `Current weather in ${city}: ${weather.temperature}, ${weather.condition}`
      : `Weather data not available for ${city}.`;
  },
  {
    name: 'get_weather',
    description: 'Get current weather information for a city',
    schema: z.object({ city: z.string().describe('The city name') })
  }
);

const getRestaurantsTool = tool(
  async ({ city }) => {
    const restaurants = mockRestaurantData[city.toLowerCase()];
    return restaurants
      ? `Popular restaurants in ${city}: ${restaurants.join(', ')}`
      : `No restaurant data available for ${city}.`;
  },
  {
    name: 'get_restaurants',
    description: 'Get restaurant recommendations for a city',
    schema: z.object({ city: z.string().describe('The city name') })
  }
);

const humanAssistanceTool = tool(
  async ({ question }) => {
    return "Human input requested";
  },
  {
    name: 'humanAssistanceTool',
    description: 'Ask for human input when you need feedback or confirmation on itinerary suggestions',
    schema: z.object({ 
      question: z.string().describe('The question to ask the human'),
    })
  }
);

const tools = [getWeatherTool, getRestaurantsTool, humanAssistanceTool];
const toolNode = new ToolNode(tools);

const model = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  temperature: 0.7,
}).bindTools(tools);

interface AgentSession {
  app: any;
  config: any;
}

const activeSessions = new Map<string, AgentSession>();

const SYSTEM_PROMPT = `You are a helpful travel assistant. Create a short, practical 3-item itinerary based on the city weather.
After you present a complete 3-item itinerary AND ask if they want adjustments, you MUST also call the humanAssistanceTool. Do this consistently for both initial and modified itineraries.`;

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;
  
  if (!lastMessage.tool_calls?.length) {
    return END;
  }
  
  if (lastMessage.tool_calls?.[0]?.name === "humanAssistanceTool") {
    return "askHuman";
  }
  
  return "tools";
}

function askHuman({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;
  const toolCall = lastMessage.tool_calls?.[0];
  const toolCallId = toolCall?.id;
  const question = toolCall?.args?.question;

  const humanResponse: string = interrupt(question);
  
  const newToolMessage = new ToolMessage({
    tool_call_id: toolCallId!,
    content: humanResponse,
  });
  
  return { messages: [newToolMessage] };
}

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

function createWorkflow() {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addNode("askHuman", askHuman)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent")
    .addEdge("askHuman", "agent")
    .addEdge(START, "agent");

  const memory = new MemorySaver();
  return workflow.compile({ checkpointer: memory });
}

async function executeAgent(threadId: string, command: any) {
  const session = activeSessions.get(threadId);
  if (!session) {
    throw new Error(`No active session found for thread: ${threadId}`);
  }

  try {
    const response = await session.app.invoke(command, session.config);
    const lastMessage = response.messages[response.messages.length - 1];
    
    const state = await session.app.getState(session.config);
    const isWaitingForInput = state.next && state.next.length > 0;
    
    return {
      content: lastMessage.content,
      isResponseNeeded: isWaitingForInput
    };
    
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      return {
        content: error.message,
        isResponseNeeded: true
      };
    }
    throw error;
  }
}

export async function handleTravelRequest(threadId: string, userInput: string, location?: string) {
  const session = activeSessions.get(threadId);
  
  // If no session exists, start new one
  if (!session) {    
    const app = createWorkflow();
    const config = { configurable: { thread_id: threadId } };
    activeSessions.set(threadId, { app, config });
    
    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(`I'm traveling to ${location}. Can you help me prepare an itinerary?`)
    ];
    
    return executeAgent(threadId, { messages });
  }
  
  // Check if waiting for interrupt response
  const state = await session.app.getState(session.config);
  const isWaitingForInput = state.next && state.next.length > 0;
  
  if (isWaitingForInput) {
    // Resume after interrupt
    return executeAgent(threadId, new Command({ resume: userInput }));
  } else {
    // Normal conversation
    return executeAgent(threadId, { messages: [new HumanMessage(userInput)] });
  }
}

// Simple test
async function test() {
  let response = await handleTravelRequest("test-1", "", "Paris");
  console.log("Assistant:", response.content);
  
  if (response.isResponseNeeded) {
    response = await handleTravelRequest("test-1", "Make it more outdoorsy");
    console.log("Assistant:", response.content);
  }
}

// test();