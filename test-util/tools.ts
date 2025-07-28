import * as zodV4 from 'zod/v4';
import * as zodV3 from 'zod/v3';
import type { ChatCompletionTool } from '../packages/orchestration/src/client/api/schema/index.js';

/**
 * @internal
 */
export const addNumbersSchemaV3 = zodV3
  .object({
    a: zodV3.number().describe('The first number to be added.'),
    b: zodV3.number().describe('The second number to be added.')
  })
  .strict();

/**
 * @internal
 */
export const addNumbersSchema = zodV4
  .object({
    a: zodV4.number().meta({ description: 'The first number to be added.' }),
    b: zodV4.number().meta({ description: 'The second number to be added.' })
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
    parameters: zodV4.toJSONSchema(addNumbersSchema)
  }
};

/**
 * @internal
 */
const multiplyNumbersSchema = zodV4
  .object({
    a: zodV4.number().meta({ description: 'The first number to multiply.' }),
    b: zodV4.number().meta({ description: 'The second number to multiply.' })
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
    parameters: zodV4.toJSONSchema(multiplyNumbersSchema)
  }
};

/**
 * @internal
 */
export const joke = zodV4.object({
  setup: zodV4.string().meta({ description: 'The setup of the joke' }),
  punchline: zodV4.string().meta({ description: 'The punchline to the joke' }),
  rating: zodV4.number().meta({ description: 'How funny the joke is, from 1 to 10' })
});
