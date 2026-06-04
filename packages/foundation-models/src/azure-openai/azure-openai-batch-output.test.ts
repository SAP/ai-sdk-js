import { parseBatchOutput } from './azure-openai-batch-output.js';

describe('parseBatchOutput', () => {
  const successLine = JSON.stringify({
    custom_id: 'request-1',
    response: {
      status_code: 200,
      request_id: 'req-abc',
      body: {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Machine learning is...' },
            finish_reason: 'stop'
          }
        ]
      }
    },
    error: null
  });

  const errorLine = JSON.stringify({
    custom_id: 'error-1',
    response: { status_code: 400, request_id: '' },
    error: { code: 'content_filter', message: 'Filtered by policy' }
  });

  it('should parse a single successful line', async () => {
    const output = await parseBatchOutput(new Blob([successLine]));

    expect(output).toHaveLength(1);
    expect(output[0].custom_id).toBe('request-1');
    expect(output[0].error).toBeNull();
    expect(output[0].response?.status_code).toBe(200);
  });

  it('should parse multiple lines', async () => {
    const output = await parseBatchOutput(
      new Blob([[successLine, errorLine].join('\n')])
    );

    expect(output).toHaveLength(2);
  });

  it('should filter successful lines', async () => {
    const output = await parseBatchOutput(
      new Blob([[successLine, errorLine].join('\n')])
    );
    const successful = output.filter(line => line.error === null);

    expect(successful).toHaveLength(1);
    expect(successful[0].custom_id).toBe('request-1');
  });

  it('should filter failed lines', async () => {
    const output = await parseBatchOutput(
      new Blob([[successLine, errorLine].join('\n')])
    );
    const failed = output.filter(line => line.error !== null);

    expect(failed).toHaveLength(1);
    expect(failed[0].custom_id).toBe('error-1');
    expect(failed[0].error?.code).toBe('content_filter');
  });

  it('should handle trailing newlines in JSONL', async () => {
    const output = await parseBatchOutput(new Blob([successLine + '\n']));

    expect(output).toHaveLength(1);
  });

  it('should provide typed access to response body', async () => {
    const output = await parseBatchOutput(new Blob([successLine]));
    const content = output[0].response?.body?.choices[0].message.content;

    expect(content).toBe('Machine learning is...');
  });
});
