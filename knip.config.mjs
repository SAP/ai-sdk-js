/** @type {import('knip').KnipConfig} */
export default {
  workspaces: {
    'sample-code': {
      entry: [
        'src/tutorials/mcp/weather-mcp-server.ts',
        'resources/generate-parquet.ts'
      ]
    },
    'tests/type-tests': {
      entry: ['test/**/*.test-d.ts']
    }
  }
};
