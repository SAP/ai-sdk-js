import { StateGraph, MessagesAnnotation, MemorySaver, START, END, interrupt, Command } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
/**
 * This example demonstrates how to create a travel itinerary assistant using LangGraph.
 * The assistant can check the weather and recommend restaurants based on the city provided.
 * It uses tools to fetch weather and restaurant data, and maintains conversation context.
 */
const mockWeatherData: Record<
  string,
  { temperature: string; condition: string }
> = {
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

// Human assistance tool - LLM calls this when it wants human input
const humanAssistanceTool = tool(
  async ({ question, context }) => {
    // This is a placeholder - the actual interrupt happens in the askHuman node
    return "Human input requested";
  },
  {
    name: 'humanAssistanceTool',
    description: 'Ask for human input when you need confirmation or adjustments to suggestions',
    schema: z.object({ 
      question: z.string().describe('The question to ask the human'),
      context: z.string().describe('Context of what you are asking about')
    })
  }
);

// Define the tools for the agent to use
const tools = [getWeatherTool, getRestaurantsTool, humanAssistanceTool];
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  temperature: 0.7,
}).bindTools(tools);



// function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
//   const lastMessage = messages[messages.length - 1] as AIMessage;
//   return lastMessage.tool_calls?.length ? 'tools' : '__end__';
// }
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;
  
  // If there is no function call, then we finish
  if (!lastMessage.tool_calls?.length) {
    return END;
  }
  
  // If tool call is humanAssistanceTool, we ask human
  if (lastMessage.tool_calls?.[0]?.name === "humanAssistanceTool") {
    console.log("--- ASKING HUMAN ---");
    return "askHuman";
  }
  
  // Otherwise continue with regular tools
  return "tools";
}

function askHuman({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;
  const toolCall = lastMessage.tool_calls?.[0];
  const toolCallId = toolCall?.id;
  const question = toolCall?.args?.question;
  const context = toolCall?.args?.context;
  
  console.log(`\nHuman Input Requested: ${question} with context: ${context}`);
  
  // This is where the actual interrupt happens
  const humanResponse: string = interrupt(`${question}: ${context}`);
  
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

// const workflow = new StateGraph(MessagesAnnotation)
//   .addNode('agent', callModel)
//   .addEdge(START, 'agent')
//   .addNode('tools', toolNode)
//   .addEdge('tools', 'agent')
//   .addConditionalEdges('agent', shouldContinue);

  const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addNode("askHuman", askHuman)
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .addEdge("askHuman", "agent")
  .addEdge(START, "agent");

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

  const config = { configurable: { thread_id: 'conv-1' } };

export async function runTravelAssistant() {
    // Initial system prompt and user message
    let messages = [
      new SystemMessage(
        `You are a helpful travel assistant. Create a short, practical 3-item itinerary based on the city weather.
       
       IMPORTANT: Every time you present or modify an itinerary, you MUST use the humanAssistanceTool to ask the user if they want adjustments. Do not just ask in text - you must call the tool.
       
       Call humanAssistanceTool with:
       - question: "Would you like me to make any adjustments to this itinerary?"
       - context: Brief description of the itinerary you just presented`
      ),
      new HumanMessage(
        "I'm traveling to Paris. Can you help me prepare an itinerary?"
      )
    ];
  
    try {
      let response = await app.invoke({ messages }, config);
     
      console.log('Assistant:', response.messages[response.messages.length - 1].content);
      
      // Continue with restaurant request
      console.log("next: ", (await app.getState(config)).next);
    
      console.log('\n--- Continuing conversation ---');
      // messages = [new HumanMessage('Can you suggest something more outdorsy?')];
      response = await app.invoke(new Command({ resume: 'Can you suggest something more outdorsy?' }), config);
     
      console.log('Assistant:', response.messages[response.messages.length - 1].content);

      console.log("next: ", (await app.getState(config)).next);

      
      // messages = [new HumanMessage('Great! Can you also recommend some restaurants?')];
      // response = await app.invoke({ messages }, config);
      response = await app.invoke(new Command({ resume: 'Great! Can you also recommend some restaurants?' }), config);
     
      console.log('Assistant:', response.messages[response.messages.length - 1].content);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

// Uncomment to run the example
runTravelAssistant();