import { createLogger } from '@sap-cloud-sdk/util';
import { LineDecoder } from './azure-openai-line-decoder.js';
import { SSEDecoder } from './azure-openai-sse-decoder.js';
import type { ServerSentEvent } from './azure-openai-sse-decoder.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-stream'
});

type Bytes = string | ArrayBuffer | Uint8Array | Buffer | null | undefined;

/**
 * Stream implemented as an async iterable.
 * @internal
 */
export class Stream<Item> implements AsyncIterable<Item> {
  protected static fromSSEResponse<Item>(response: HttpResponse): Stream<Item> {
    let consumed = false;

    async function* iterator(): AsyncIterator<Item, any, undefined> {
      if (consumed) {
        throw new Error('Cannot iterate over a consumed stream.');
      }
      consumed = true;
      let done = false;
      for await (const sse of _iterSSEMessages(response)) {
        if (done) {
          continue;
        }

        if (sse.data.startsWith('[DONE]')) {
          done = true;
          continue;
        }

        if (sse.event === null) {
          let data;

          try {
            data = JSON.parse(sse.data);
          } catch (e: any) {
            logger.error(`Could not parse message into JSON: ${sse.data}`);
            logger.error(`From chunk: ${sse.raw}`);
            throw e;
          }

          if (data && data.error) {
            throw new Error(data.error);
          }

          yield data;
        } else {
          let data;
          try {
            data = JSON.parse(sse.data);
          } catch (e: any) {
            logger.error(`Could not parse message into JSON: ${sse.data}`);
            logger.error(`From chunk: ${sse.raw}`);
            throw e;
          }
          // TODO: Is this where the error should be thrown?
          if (sse.event === 'error') {
            // throw new Error(data.error, data.message);
            throw new Error(data.error);
          }
          yield { event: sse.event, data } as any;
        }
      }
      done = true;
    }

    return new Stream(iterator);
  }

  constructor(public iterator: () => AsyncIterator<Item>) {}

  [Symbol.asyncIterator](): AsyncIterator<Item> {
    return this.iterator();
  }
}

/**
 * @internal
 */
export async function* _iterSSEMessages(
  response: HttpResponse
): AsyncGenerator<ServerSentEvent, void, unknown> {
  if (!response.data) {
    throw new Error('Attempted to iterate over a response with no body');
  }

  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();

  const iter = response.data;
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse) {
        yield sse;
      }
    }
  }

  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse) {
      yield sse;
    }
  }
}

/**
 * Given an async iterable iterator, iterates over it and yields full
 * SSE chunks, i.e. yields when a double new-line is encountered.
 * @param iterator - Async iterable iterator.
 * @returns Async generator of Uint8Array.
 * @internal
 */
async function* iterSSEChunks(
  iterator: AsyncIterableIterator<Bytes>
): AsyncGenerator<Uint8Array> {
  let data = new Uint8Array();

  for await (const chunk of iterator) {
    if (chunk == null) {
      continue;
    }

    const binaryChunk =
      chunk instanceof ArrayBuffer
        ? new Uint8Array(chunk)
        : typeof chunk === 'string'
          ? new TextEncoder().encode(chunk)
          : chunk;

    const newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;

    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }

  if (data.length > 0) {
    yield data;
  }
}

function findDoubleNewlineIndex(buffer: Uint8Array): number {
  // This function searches the buffer for the end patterns (\r\r, \n\n, \r\n\r\n)
  // and returns the index right after the first occurrence of any pattern,
  // or -1 if none of the patterns are found.
  const newline = 0x0a; // \n
  const carriage = 0x0d; // \r

  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      // \n\n
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      // \r\r
      return i + 2;
    }
    if (
      buffer[i] === carriage &&
      buffer[i + 1] === newline &&
      i + 3 < buffer.length &&
      buffer[i + 2] === carriage &&
      buffer[i + 3] === newline
    ) {
      // \r\n\r\n
      return i + 4;
    }
  }

  return -1;
}

/**
 * This is an internal helper function that's just used for testing.
 * @param chunks - The chunks to decode.
 * @returns The decoded lines.
 * @internal
 */
export function _decodeChunks(chunks: string[]): string[] {
  const decoder = new LineDecoder();
  const lines: string[] = [];
  for (const chunk of chunks) {
    lines.push(...decoder.decode(chunk));
  }

  return lines;
}
