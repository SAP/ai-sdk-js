import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import type { ChatCompletionTool } from '../client/api/schema/index.js';

const addNumbersSchema = z
  .object({
    a: z.number().describe('The first number to be added.'),
    b: z.number().describe('The second number to be added.')
  })
  .strict();

/**
 * @internal
 */
export const addTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'add',
    description: 'Adds two numbers',
    parameters: zodToJsonSchema(addNumbersSchema)
  }
};

const multiplyNumbersSchema = z
  .object({
    a: z.number().describe('The first number to multiply.'),
    b: z.number().describe('The second number to multiply.')
  })
  .strict();

/**
 * @internal
 */
export const multiplyTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'multiply',
    description: 'Multiplies two numbers',
    parameters: zodToJsonSchema(multiplyNumbersSchema)
  }
};
