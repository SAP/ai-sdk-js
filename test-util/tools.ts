// eslint-disable-next-line import/no-internal-modules
import * as z from 'zod/v4';
import type { ChatCompletionTool } from '../packages/orchestration/src/client/api/schema/index.js';

/**
 * @internal
 */
export const addNumbersSchema = z
  .object({
    a: z.number().describe('The first number to be added.'),
    b: z.number().describe('The second number to be added.')
  })
  .strict();

/**
 * @internal
 */
export const addNumbersTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'add',
    description: 'Adds two numbers',
    parameters: z.toJSONSchema(addNumbersSchema)
  }
};

/**
 * @internal
 */
const multiplyNumbersSchema = z
  .object({
    a: z.number().describe('The first number to multiply.'),
    b: z.number().describe('The second number to multiply.')
  })
  .strict();

/**
 * @internal
 */
export const multiplyNumbersTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'multiply',
    description: 'Multiplies two numbers',
    parameters: z.toJSONSchema(multiplyNumbersSchema)
  }
};

/**
 * @internal
 */
export const joke = z.object({
  setup: z.string().describe('The setup of the joke'),
  punchline: z.string().describe('The punchline to the joke'),
  rating: z.number().describe('How funny the joke is, from 1 to 10')
});
