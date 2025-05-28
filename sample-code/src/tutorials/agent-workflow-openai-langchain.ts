import { StateGraph, MessagesAnnotation, MemorySaver, START } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Mock weather data
const mockWeatherData: Record<string, { temperature: string; condition: string }> = {
  paris: {
    temperature: "22°C",
    condition: "Mild and pleasant"
  },
  reykjavik: {
    temperature: "3°C", 
    condition: "Cold and windy"
  }
};

// Mock restaurant data
const mockRestaurantData: Record<string, string[]> = {
  paris: ["Le Comptoir du Relais", "L'As du Fallafel", "Breizh Café"],
  reykjavik: ["Dill Restaurant", "Fish Market", "Grillmarkaðurinn"]
};

// Define the weather tool
const getWeatherTool = tool(
  async ({ city }) => {
    const cityLower = city.toLowerCase();
    
    if (mockWeatherData[cityLower]) {
      const weather = mockWeatherData[cityLower];
      return `Current weather in ${city}: ${weather.temperature}, ${weather.condition}`;
    }
    
    // LLM should handle unknown cities intelligently
    return `Weather data not available for ${city}. Check a weather service for current conditions.`;
  },
  {
    name: "get_weather",
    description: "Get current weather information for a city",
    schema: z.object({
      city: z.string().describe("The city name")
    })
  }
);

// Define the restaurant recommendation tool
const getRestaurantsTool = tool(
  async ({ city }) => { 
    const cityLower = city.toLowerCase();
    
    if (mockRestaurantData[cityLower]) {
      return `Popular restaurants in ${city}: ${mockRestaurantData[cityLower].join(", ")}`;
    }
    
    return `I don't have specific restaurant data for ${city}. I'd recommend checking local food guides or review sites.`;
  },
  {
    name: "get_restaurants",
    description: "Get restaurant recommendations for a city",
    schema: z.object({
      city: z.string().describe("The city name")
    })
  }
);

// Define the tools for the agent to use
const tools = [getWeatherTool, getRestaurantsTool];
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  temperature: 0.7,
}).bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user) using the special "__end__" node
  return "__end__";
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  // Update message history with response
 // console.log("🤖 Assistant response:", response);
  return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  const config = { configurable: { thread_id: 'conv-1' } };

// Example usage demonstrating conversation memory
export async function runTravelAssistant() {
  console.log("🗺️ Travel Itinerary Assistant Started!");
  
  // Start a conversation
  let messages = [
    new SystemMessage("You are a helpful travel assistant. Always check the weather before suggesting an itinerary. Create a short, practical 3-item itinerary based on weather and city."),
    new HumanMessage("I'm traveling to Paris. Can you help me prepare an itinerary?")
  ];
  
  // First interaction - should call weather tool
  let response = await app.invoke({ messages }, config);;
  console.log("🤖 Assistant:", response.messages[response.messages.length - 1]);
  
  // Continue conversation - add restaurant question
  messages = [new HumanMessage("Can you also recommend some restaurants?")];
  
  // Second interaction - should remember Paris and call restaurant tool
  response = await app.invoke({ messages }, config);
  console.log("🤖 Assistant:", response.messages[response.messages.length - 1]);
}

// Uncomment to run the example
runTravelAssistant().catch(console.error);