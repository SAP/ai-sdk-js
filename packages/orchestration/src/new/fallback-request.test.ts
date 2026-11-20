import { Orchestration } from './orchestration.ts';

import type { CompletionPostRequest } from '../client/api/schema/index.ts';
import type { CompletionApi } from './orchestration-completion.ts';

/**
 * Pins the wire body of both fallback-chain assembly paths before the fallback
 * helper is generalized to accept a config list.
 * `completion.create({ promptConfigs })` spreads one shared config across every
 * fallback; `withModules([c0, c1]).create({ promptConfigs })` spreads a distinct
 * config per fallback index.
 * Both paths route through `CompletionApi.post`, so spying on it captures the
 * exact request each builds without any HTTP.
 */
describe('fallback-chain request assembly', () => {
  function spyOnPost(completion: CompletionApi): {
    getBody: () => CompletionPostRequest;
  } {
    const captured: { body?: CompletionPostRequest } = {};
    vi.spyOn(completion, 'post').mockImplementation(
      async (body: CompletionPostRequest | string) => {
        captured.body = body as CompletionPostRequest;
        return undefined as any;
      }
    );
    return { getBody: () => captured.body as CompletionPostRequest };
  }

  const messages = [
    { role: 'assistant' as const, content: 'You are a helpful assistant.' }
  ];

  it('spreads one shared config across every fallback via completion.create', async () => {
    const { completion } = new Orchestration();
    const { getBody } = spyOnPost(completion);

    await completion.create({
      promptConfigs: [
        { model: 'amazon--nova-lite', messages },
        { model: { name: 'amazon--nova-micro' }, messages }
      ],
      stream: true
    });

    expect(getBody()).toMatchSnapshot();
  });

  it('spreads a distinct config per fallback index via withModules(list).create', async () => {
    const { completion } = new Orchestration();
    const { getBody } = spyOnPost(completion);

    await completion
      .withModules([
        {
          filtering: { input: { filters: [{ type: 'azure_content_safety' }] } }
        },
        {
          filtering: {
            input: {
              filters: [
                {
                  type: 'granite_guardian_4_1',
                  config: { categories: { harm: true } }
                }
              ]
            }
          }
        }
      ])
      .create({
        promptConfigs: [
          { model: 'amazon--nova-lite', messages },
          { model: { name: 'amazon--nova-micro' }, messages }
        ],
        stream: true
      });

    expect(getBody()).toMatchSnapshot();
  });
});
