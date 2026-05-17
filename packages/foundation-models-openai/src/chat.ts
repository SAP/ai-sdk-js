import { SapCompletions } from './completions.js';
import type { OpenAI } from 'openai';

/** Wraps `Chat` exposing only `completions`. */
export class SapChat {
  readonly completions: SapCompletions;

  constructor(client: OpenAI) {
    this.completions = new SapCompletions(client);
  }
}
