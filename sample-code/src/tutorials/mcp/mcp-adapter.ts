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
      command: 'node',
      args: [
        '--env-file-if-exists=.env',
        './src/tutorials/mcp/weather-mcp-server.ts'
      ]
    }
  }
});
