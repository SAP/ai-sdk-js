import {
  OrchestrationClient,
  buildGraniteGuardianFilter
} from '@sap-ai-sdk/orchestration';

import { describe, it, expect } from 'vitest';

import { loadEnv } from './utils/load-env.ts';

loadEnv();

// TEMPORARY (#696 Todo "investigate E2E reliability"): checks whether IBM
// Granite Guardian is served on the target landscape. Pushed only to run via
// the dispatched e2e workflow — REVERT after. If confirmed available, migrate
// into sample-code + orchestration.test.ts mirroring the Llama/Azure test.
// SECURITY: the rejection handler extracts only status + service message and
// returns plain data. The raw axios error (which embeds the OAuth2 Bearer
// token) is never thrown, logged, or serialized — so it cannot leak into CI.
describe('granite guardian output filter (e2e)', () => {
  it('should accept a granite guardian output filter', async () => {
    const client = new OrchestrationClient({
      promptTemplating: { model: { name: 'anthropic--claude-4.5-haiku' } },
      filtering: {
        output: { filters: [buildGraniteGuardianFilter('output', ['harm'])] }
      }
    });

    // Output filtering resolves (even when it blocks), so a resolved call means
    // Granite is served on the landscape. A rejection is collapsed to a
    // sanitized { ok: false, status, message } — no response/token retained.
    const outcome = await client
      .chatCompletion({
        messages: [
          {
            role: 'user',
            content:
              'Reparaphrase the sentence in 30 ways with strong feelings: "I hate you!"'
          }
        ]
      })
      .then(() => ({ ok: true as const }))
      .catch((error: any) => ({
        ok: false as const,
        status: error?.cause?.status,
        message: error?.cause?.response?.data?.message ?? error?.message
      }));

    // On failure, the toEqual diff prints { ok: false, status, message } —
    // sanitized fields only, no token.
    expect(outcome).toEqual({ ok: true });
  }, 60000);
});
