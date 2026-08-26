import { describe, it, expect, vi } from 'vitest';

import { pollAsyncResource } from './poll-async-resource.ts';

describe('pollAsyncResource', () => {
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
});
