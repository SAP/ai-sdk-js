// NOTE: ALL code changes in this file MUST be reflected in the documentation portal.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod';

function buildGeocodingUrl(city: string): string {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search = new URLSearchParams({
    name: city,
    count: '10',
    language: 'en',
    format: 'json'
  }).toString();

  return url.toString();
}

function buildForecastUrl(latitude: unknown, longitude: unknown): string {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: Number(latitude).toString(),
    longitude: Number(longitude).toString(),
    hourly:
      'temperature_2m,precipitation,apparent_temperature,relative_humidity_2m',
    forecast_days: '1'
  }).toString();

  return url.toString();
}

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
      const geoUrl = buildGeocodingUrl(city);
      const geoResponse = await fetch(geoUrl);
      const data = (await geoResponse.json()) as {
        results?: { latitude: number; longitude: number }[];
      };

      if (!data.results?.length) {
        return {
          content: [
            { type: 'text', text: `No results found for city: ${city}` }
          ]
        };
      }

      const { latitude, longitude } = data.results[0];
      const weatherUrl = buildForecastUrl(latitude, longitude);
      const weatherResponse = await fetch(weatherUrl);

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
