import { describe, it, expect, vi } from 'vitest';

import { pollAsyncResource } from './poll-async-resource.ts';

describe('pollAsyncResource', () => {
  it('rejects after the maximum number of attempts with default settings', async () => {
    let reads = 0;
    const waits: number[] = [];

    await expect(
      pollAsyncResource({
        read: async () => {
          reads++;
          return { status: 'PROCESSING' };
        },
        isComplete: () => false,
        sleep: async ms => {
          waits.push(ms);
        }
      })
    ).rejects.toThrow('did not complete after 10 attempts');

    expect(reads).toBe(10);
    expect(waits).toEqual(Array(9).fill(1_000));
  });

  it('returns the first completed resource', async () => {
    const resources = [{ status: 'PROCESSING' }, { status: 'ACTIVE' }];
    let reads = 0;
    let sleeps = 0;

    const result = await pollAsyncResource({
      read: async () => resources[reads++]!,
      isComplete: resource => resource.status === 'ACTIVE',
      maxAttempts: 3,
      intervalMs: 0,
      sleep: async () => {
        sleeps++;
      }
    });

    expect(result).toEqual({ status: 'ACTIVE' });
    expect(reads).toBe(2);
    expect(sleeps).toBe(1);
  });

  it('throws the resource failure without polling again', async () => {
    let reads = 0;

    await expect(
      pollAsyncResource({
        read: async () => {
          reads++;
          return { status: 'ERROR', errorMessage: 'schema derivation failed' };
        },
        isComplete: resource => resource.status === 'ACTIVE',
        getFailure: resource =>
          resource.status === 'ERROR' ? resource.errorMessage : undefined,
        maxAttempts: 3,
        intervalMs: 0,
        sleep: vi.fn()
      })
    ).rejects.toThrow('schema derivation failed');
    expect(reads).toBe(1);
  });

  it('throws after the maximum number of attempts', async () => {
    let reads = 0;

    await expect(
      pollAsyncResource({
        read: async () => {
          reads++;
          return { status: 'PROCESSING' };
        },
        isComplete: () => false,
        maxAttempts: 2,
        intervalMs: 0,
        sleep: vi.fn()
      })
    ).rejects.toThrow('did not complete after 2 attempts');
    expect(reads).toBe(2);
  });

  it('honors retry-after from the initial response and polling responses', async () => {
    const responses = [
      {
        data: { status: 'PROCESSING' },
        headers: { 'retry-after': '3' }
      },
      {
        data: { status: 'ACTIVE' },
        headers: { 'retry-after': '7' }
      }
    ];
    const waits: number[] = [];

    await pollAsyncResource({
      read: async () => responses.shift()!,
      getResource: response => response.data,
      isComplete: resource => resource.status === 'ACTIVE',
      initialRetryAfter: '5',
      getRetryAfter: response => response.headers['retry-after'],
      sleep: async ms => {
        waits.push(ms);
      }
    });

    expect(waits).toEqual([5_000, 3_000]);
  });

  it('falls back to the polling interval for an invalid retry-after value', async () => {
    const responses = [
      {
        data: { status: 'PROCESSING' },
        headers: { 'retry-after': '1.5' }
      },
      { data: { status: 'ACTIVE' }, headers: {} }
    ];
    const waits: number[] = [];

    await pollAsyncResource({
      read: async () => responses.shift()!,
      getResource: response => response.data,
      isComplete: resource => resource.status === 'ACTIVE',
      intervalMs: 250,
      getRetryAfter: response => response.headers['retry-after'],
      sleep: async ms => {
        waits.push(ms);
      }
    });

    expect(waits).toEqual([250]);
  });

  it('falls back to the polling interval for an invalid HTTP-date retry-after value', async () => {
    const responses = [
      {
        data: { status: 'PROCESSING' },
        headers: { 'retry-after': 'Thu, 31 Apr 2099 00:00:00 GMT' }
      },
      { data: { status: 'ACTIVE' }, headers: {} }
    ];
    const waits: number[] = [];

    await pollAsyncResource({
      read: async () => responses.shift()!,
      getResource: response => response.data,
      isComplete: resource => resource.status === 'ACTIVE',
      intervalMs: 250,
      getRetryAfter: response => response.headers['retry-after'],
      sleep: async ms => {
        waits.push(ms);
      }
    });

    expect(waits).toEqual([250]);
  });

  it('stops before reading or waiting when the signal is already aborted', async () => {
    let reads = 0;
    const reason = new Error('cancelled');
    const sleep = vi.fn();

    await expect(
      pollAsyncResource({
        read: async () => {
          reads++;
          return { status: 'PROCESSING' };
        },
        isComplete: () => false,
        initialRetryAfter: '1',
        signal: AbortSignal.abort(reason),
        sleep
      })
    ).rejects.toBe(reason);

    expect(reads).toBe(0);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('throws the abort reason when no attempts are configured', async () => {
    const reason = new Error('cancelled');

    await expect(
      pollAsyncResource({
        read: vi.fn(),
        isComplete: () => false,
        maxAttempts: 0,
        signal: AbortSignal.abort(reason)
      })
    ).rejects.toBe(reason);
  });

  it('throws when polling is aborted while reading', async () => {
    const controller = new AbortController();
    const reason = new Error('cancelled');

    await expect(
      pollAsyncResource({
        read: async () => {
          controller.abort(reason);
          return { status: 'ACTIVE' };
        },
        isComplete: resource => resource.status === 'ACTIVE',
        signal: controller.signal,
        sleep: vi.fn()
      })
    ).rejects.toBe(reason);
  });

  it('preserves the abort reason when the default wait is cancelled', async () => {
    const controller = new AbortController();
    const reason = new Error('cancelled');
    const promise = pollAsyncResource({
      read: vi.fn(),
      isComplete: () => false,
      initialRetryAfter: '1',
      signal: controller.signal
    });

    queueMicrotask(() => {
      controller.abort(reason);
    });

    await expect(promise).rejects.toBe(reason);
  });
});
