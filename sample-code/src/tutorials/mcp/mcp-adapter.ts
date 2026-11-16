// NOTE: ALL code changes in this file MUST be reflected in the documentation portal.

import { MCPAdapter } from '@langchain/mcp-adapters';

/**
 * Client to connect to multiple MCP servers.
 */
export const mcpClient = new MCPAdapter({
  throwOnLoadError: true,
  prefixToolNameWithServerName: false,
  additionalToolNamePrefix: '',
  servers: {
    weather: {
      command: 'node',
      args: [
        '--env-file-if-exists=.env',
        './src/tutorials/mcp/weather-mcp-server.ts'
      ]
    }
  }
});
