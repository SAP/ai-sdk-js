// NOTE: ALL code changes in this file MUST be reflected in the documentation portal.

/* eslint-disable import/no-internal-modules */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod';

const server = new McpServer({
  name: 'Open-Meteo Weather MCP Server',
  version: '1.0.0'
});

server.registerTool(
  'get_weather',
  {
    description: 'Tool to fetch weather details for a specific city',
    inputSchema: {
      city: z
        .string()
        .meta({ description: 'The name of the city to get the weather for' })
    }
  },
  async ({ city }) => {
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
      );
      const data = await geoResponse.json();

      if (!data.results?.length) {
        return {
          content: [
            { type: 'text', text: `No results found for city: ${city}` }
          ]
        };
      }

      const { latitude, longitude } = data.results[0];
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,apparent_temperature,relative_humidity_2m&forecast_days=1`
      );

      const weatherData = await weatherResponse.json();

      return {
        content: [{ type: 'text', text: JSON.stringify(weatherData, null, 2) }]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching weather data: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
