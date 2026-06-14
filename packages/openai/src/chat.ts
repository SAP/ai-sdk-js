import { SapCompletions } from './completions.js';
import type { OpenAI } from 'openai';

/**
 * Wraps `Chat` exposing only `completions`.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapChat {
  readonly completions: SapCompletions;

  constructor(client: OpenAI) {
    this.completions = new SapCompletions(client);
  }
}
