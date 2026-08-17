/** @type {import('knip').KnipConfig} */
export default {
  workspaces: {
    'sample-code': {
      // files not referenced in package.json scripts/bin and thus not auto-detected as entries
      // Knip usually automatically detects entry files based on package.json scripts/bin, but these are used indirectly.
      entry: [
        'src/tutorials/mcp/weather-mcp-server.ts',
        'resources/generate-parquet.ts',
        'src/support-bot/agent.ts'
      ],
      // spawned as CLI processes by the MCP client, so knip can't trace them
      ignoreDependencies: [
        '@modelcontextprotocol/server-github',
        '@upstash/context7-mcp'
      ]
    },
    'tests/type-tests': {
      // tsd entry files are not auto-detected; knip has no built-in handling for them
      entry: ['test/**/*.test-d.ts']
    }
  }
};
