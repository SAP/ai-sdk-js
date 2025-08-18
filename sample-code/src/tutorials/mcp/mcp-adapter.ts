import { MultiServerMCPClient } from '@langchain/mcp-adapters';

// Create client and connect to server
const client = new MultiServerMCPClient({
  throwOnLoadError: true,
  prefixToolNameWithServerName: false,
  additionalToolNamePrefix: '',
  useStandardContentBlocks: true,
  mcpServers: {
    weather: {
      command: 'npx',
      args: ['tsx', './src/tutorials/mcp/weather-mcp-server.ts']
    }
  }
});

/**
 * Fetches tools from the MCP server.
 * @returns An array of tools for fetching weather data.
 */
export const getMcpTools = await client.getTools();
