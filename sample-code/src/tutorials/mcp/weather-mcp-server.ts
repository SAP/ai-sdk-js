/* eslint-disable import/no-internal-modules */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod/v4';

const server = new McpServer({
  name: 'Open-Meteo Weather MCP Server',
  version: '1.0.0'
});

server.tool(
  'get-weather',
  'Tool to fetch weather details for a specific city',
  {
    city: z
      .string()
      .meta({ description: 'The name of the city to get the weather for' })
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
