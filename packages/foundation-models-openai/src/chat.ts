import { Chat } from 'openai/resources/chat/chat';
import { SapCompletions } from './completions.js';
import type { OpenAI } from 'openai';

/** Subclass of `Chat` exposing only `completions`. Unsupported properties are marked `never`. */
export class SapChat extends Chat {
  override completions: SapCompletions;

  constructor(client: OpenAI, defaultModel?: string) {
    super(client);
    this.completions = new SapCompletions(client, defaultModel);
  }
}
