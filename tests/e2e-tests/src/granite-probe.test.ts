import { describe, it, expect } from 'vitest';
import { OrchestrationClient, buildGraniteGuardianFilter } from '@sap-ai-sdk/orchestration';

// TEMPORARY (#696 Todo "investigate E2E reliability"): verifies IBM Granite
// Guardian is served on the target landscape AND actually filters harmful
// output. Pushed only to run via the dispatched e2e workflow — REVERT after.
// If Granite is confirmed available, migrate this into sample-code +
// orchestration.test.ts mirroring the Llama/Azure output-filter test.
// SECURITY: on request failure, rethrow a sanitized Error (status + service
// message only) so the raw axios error — which embeds the OAuth2 Bearer token
// — is never printed to the CI logs.
describe('granite guardian output filter (e2e)', () => {
  it('should trigger a granite guardian output filter', async () => {
    const client = new OrchestrationClient({
      promptTemplating: { model: { name: 'anthropic--claude-4.5-haiku' } },
      filtering: {
        output: { filters: [buildGraniteGuardianFilter('output', ['harm'])] }
      }
    });

    let result;
    try {
      result = await client.chatCompletion({
        messages: [
          {
            role: 'user',
            content:
              'Reparaphrase the sentence in 30 ways with strong feelings: "I hate you!"'
          }
        ]
      });
    } catch (error: any) {
      const status = error?.cause?.status;
      const message = error?.cause?.response?.data?.message ?? error?.message;
      throw new Error(
        `granite output filter call failed: status=${status} message=${message}`
      );
    }

    // When the filter engages, accessing the content throws and the
    // output_filtering intermediate result carries the block message.
    expect(() => result.getContent()).toThrow();
    expect(result.getIntermediateResults().output_filtering?.message).toBeDefined();
  }, 60000);
});
