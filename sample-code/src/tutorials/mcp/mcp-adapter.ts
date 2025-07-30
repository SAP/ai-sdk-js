import { MultiServerMCPClient } from "@langchain/mcp-adapters";

// Create client and connect to server
const client = new MultiServerMCPClient({
  throwOnLoadError: true,
  prefixToolNameWithServerName: false,
  additionalToolNamePrefix: "",
  useStandardContentBlocks: true,
  mcpServers: {
     weather: {
      command: "npx",
      args: ["tsx", "./src/tutorials/mcp-server/weather-mcp.ts"]
    }
  }
});
export const getWeatherTools = await client.getTools()