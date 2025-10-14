// NOTE: ALL code changes in this file MUST be reflected in the documentation portal.

import { MultiServerMCPClient } from '@langchain/mcp-adapters';

/**
 * Client to connect to multiple MCP servers.
 */
export const mcpClient = new MultiServerMCPClient({
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
