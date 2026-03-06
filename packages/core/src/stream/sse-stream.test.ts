import assert from 'assert';
import {
  SseStream,
  _iterSseMessages,
  _decodeChunks as decodeChunks
} from './sse-stream.js';

describe('line decoder', () => {
  test('basic', () => {
    // baz is not included because the line hasn't ended yet
    expect(decodeChunks(['foo', ' bar\nbaz'])).toEqual(['foo bar']);
  });

  test('basic with \\r', () => {
    // baz is not included because the line hasn't ended yet
    expect(decodeChunks(['foo', ' bar\r\nbaz'])).toEqual(['foo bar']);
  });

  test('trailing new lines', () => {
    expect(decodeChunks(['foo', ' bar', 'baz\n', 'thing\n'])).toEqual([
      'foo barbaz',
      'thing'
    ]);
  });

  test('trailing new lines with \\r', () => {
    expect(decodeChunks(['foo', ' bar', 'baz\r\n', 'thing\r\n'])).toEqual([
      'foo barbaz',
      'thing'
    ]);
  });

  test('escaped new lines', () => {
    expect(decodeChunks(['foo', ' bar\\nbaz\n'])).toEqual(['foo bar\\nbaz']);
  });

  test('escaped new lines with \\r', () => {
    expect(decodeChunks(['foo', ' bar\\r\\nbaz\n'])).toEqual([
      'foo bar\\r\\nbaz'
    ]);
  });
});

describe('streaming decoding', () => {
  test('basic', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('event: completion\n');
      yield Buffer.from('data: {"foo":true}\n');
      yield Buffer.from('\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(JSON.parse(event.value.data)).toEqual({ foo: true });

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('data without event', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('data: {"foo":true}\n');
      yield Buffer.from('\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(event.value.event).toBeNull();
    expect(JSON.parse(event.value.data)).toEqual({ foo: true });

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('event without data', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('event: foo\n');
      yield Buffer.from('\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('foo');
    expect(event.value.data).toEqual('');

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('multiple events', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('event: foo\n');
      yield Buffer.from('\n');
      yield Buffer.from('event: ping\n');
      yield Buffer.from('\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('foo');
    expect(event.value.data).toEqual('');

    event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('ping');
    expect(event.value.data).toEqual('');

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('multiple events with data', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('event: foo\n');
      yield Buffer.from('data: {"foo":true}\n');
      yield Buffer.from('\n');
      yield Buffer.from('event: ping\n');
      yield Buffer.from('data: {"bar":false}\n');
      yield Buffer.from('\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('foo');
    expect(JSON.parse(event.value.data)).toEqual({ foo: true });

    event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('ping');
    expect(JSON.parse(event.value.data)).toEqual({ bar: false });

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('multiple data lines with empty line', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('event: ping\n');
      yield Buffer.from('data: {\n');
      yield Buffer.from('data: "foo":\n');
      yield Buffer.from('data: \n');
      yield Buffer.from('data:\n');
      yield Buffer.from('data: true}\n');
      yield Buffer.from('\n\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('ping');
    expect(JSON.parse(event.value.data)).toEqual({ foo: true });
    expect(event.value.data).toEqual('{\n"foo":\n\n\ntrue}');

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('data json escaped double new line', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('event: ping\n');
      yield Buffer.from('data: {"foo": "my long\\n\\ncontent"}');
      yield Buffer.from('\n\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('ping');
    expect(JSON.parse(event.value.data)).toEqual({ foo: 'my long\n\ncontent' });

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('special new line characters', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('data: {"content": "culpa "}\n');
      yield Buffer.from('\n');
      yield Buffer.from('data: {"content": "');
      yield Buffer.from([0xe2, 0x80, 0xa8]);
      yield Buffer.from('"}\n');
      yield Buffer.from('\n');
      yield Buffer.from('data: {"content": "foo"}\n');
      yield Buffer.from('\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(JSON.parse(event.value.data)).toEqual({ content: 'culpa ' });

    event = await stream.next();
    assert(event.value);
    expect(JSON.parse(event.value.data)).toEqual({
      content: Buffer.from([0xe2, 0x80, 0xa8]).toString()
    });

    event = await stream.next();
    assert(event.value);
    expect(JSON.parse(event.value.data)).toEqual({ content: 'foo' });

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('multi-byte characters across chunks', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('event: completion\n');
      yield Buffer.from('data: {"content": "');
      // bytes taken from the string 'известни' and arbitrarily split
      // so that some multi-byte characters span multiple chunks
      yield Buffer.from([0xd0]);
      yield Buffer.from([0xb8, 0xd0, 0xb7, 0xd0]);
      yield Buffer.from([
        0xb2, 0xd0, 0xb5, 0xd1, 0x81, 0xd1, 0x82, 0xd0, 0xbd, 0xd0, 0xb8
      ]);
      yield Buffer.from('"}\n');
      yield Buffer.from('\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    let event = await stream.next();
    assert(event.value);
    expect(event.value.event).toEqual('completion');
    expect(JSON.parse(event.value.data)).toEqual({ content: 'известни' });

    event = await stream.next();
    expect(event.done).toBeTruthy();
  });

  test('invalid payload', async () => {
    async function* body(): AsyncGenerator<Buffer> {
      yield Buffer.from('data: {"content": "culpa "}\n');
      yield Buffer.from('\n');
      yield Buffer.from('{"error":"Something went wrong"}\n');
    }

    const response = {
      data: body()
    } as any;

    const stream = _iterSseMessages(response, new AbortController())[
      Symbol.asyncIterator
    ]();

    const event = await stream.next();
    assert(event.value);
    expect(event.value.event).toBeNull();
    expect(JSON.parse(event.value.data)).toEqual({ content: 'culpa ' });

    expect(stream.next()).rejects.toThrow(
      'Invalid SSE payload: {"error":"Something went wrong"}'
    );
  });
});

function createMockSseStream<T>(items: T[]): SseStream<T> {
  const controller = new AbortController();
  async function* iterator(): AsyncGenerator<T> {
    for (const item of items) {
      yield item;
    }
  }
  return new SseStream(iterator, controller);
}

async function collectReadableStream(
  stream: ReadableStream<Uint8Array>
): Promise<string[]> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const lines: string[] = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const text = decoder.decode(value).trimEnd();
    if (text) {
      lines.push(text);
    }
  }

  return lines;
}

describe('toReadableStream', () => {
  test('produces NDJSON output from items', async () => {
    const stream = createMockSseStream([
      { foo: true },
      { bar: 'hello' },
      { baz: 42 }
    ]);

    const lines = await collectReadableStream(stream.toReadableStream());

    expect(lines).toEqual(['{"foo":true}', '{"bar":"hello"}', '{"baz":42}']);
  });

  test('handles empty stream', async () => {
    const stream = createMockSseStream([]);
    const lines = await collectReadableStream(stream.toReadableStream());
    expect(lines).toEqual([]);
  });

  test('handles single item', async () => {
    const stream = createMockSseStream([{ only: 'one' }]);
    const lines = await collectReadableStream(stream.toReadableStream());
    expect(lines).toEqual(['{"only":"one"}']);
  });

  test('aborts controller on cancel', async () => {
    const controller = new AbortController();
    let yieldCount = 0;

    async function* iterator(): AsyncGenerator<{ n: number }> {
      while (true) {
        yieldCount++;
        yield { n: yieldCount };
      }
    }

    const sseStream = new SseStream(iterator, controller);
    const readable = sseStream.toReadableStream();
    const reader = readable.getReader();

    await reader.read();
    expect(yieldCount).toBe(1);

    await reader.cancel();
    expect(controller.signal.aborted).toBe(true);
  });

  test('propagates iterator errors', async () => {
    const controller = new AbortController();
    async function* iterator(): AsyncGenerator<{ n: number }> {
      yield { n: 1 };
      throw new Error('stream failure');
    }

    const sseStream = new SseStream(iterator, controller);
    const readable = sseStream.toReadableStream();
    const reader = readable.getReader();

    const first = await reader.read();
    expect(first.done).toBe(false);

    await expect(reader.read()).rejects.toThrow('stream failure');
  });

  test('cleans up on serialization error', async () => {
    const controller = new AbortController();
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    async function* iterator(): AsyncGenerator<Record<string, unknown>> {
      yield { ok: true };
      yield circular;
    }

    const sseStream = new SseStream(iterator, controller);
    const readable = sseStream.toReadableStream();
    const reader = readable.getReader();

    const first = await reader.read();
    expect(first.done).toBe(false);

    await expect(reader.read()).rejects.toThrow();
    expect(controller.signal.aborted).toBe(true);
  });

  test('aborts controller even if iterator.return() rejects', async () => {
    const controller = new AbortController();
    let returnCalled = false;

    const brokenIterator: AsyncIterableIterator<{ n: number }> = {
      next: async () => ({ value: { n: 1 }, done: false }),
      return: async () => {
        returnCalled = true;
        throw new Error('return failed');
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };

    const sseStream = new SseStream(() => brokenIterator, controller);
    const readable = sseStream.toReadableStream();
    const reader = readable.getReader();

    await reader.read();
    await reader.cancel();

    expect(returnCalled).toBe(true);
    expect(controller.signal.aborted).toBe(true);
  });
});
