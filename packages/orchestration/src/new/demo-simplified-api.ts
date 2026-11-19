// oxlint-disable no-unused-vars
import { Orchestration } from './orchestration.ts';

// NO LONGER VALID: inline template in config
// instead: inline template with other config
await new Orchestration().completion
  .withModules({
    filtering: { input: { filters: [{ type: 'azure_content_safety' }] } }
  })
  .create({
    model: 'amazon--nova-lite',
    messages: [{ role: 'assistant', content: 'You are a helpful assistant.' }],
    stream: true
  });

// instead: inline template without other config
await new Orchestration().completion.create({
  model: 'amazon--nova-lite',
  messages: [{ role: 'assistant', content: 'You are a helpful assistant.' }],
  stream: true
});

// NO LONGER VALID: template ref in config
// instead:  template ref with other config
await new Orchestration().completion
  .withModules({
    filtering: { input: { filters: [{ type: 'azure_content_safety' }] } }
  })
  .create({
    model: 'amazon--nova-lite',
    template_ref: { id: 'ID' },
    stream: true
  });

// instead: template ref without other config
await new Orchestration().completion.create({
  model: 'amazon--nova-lite',
  template_ref: { id: 'ID' },
  stream: true
});

// NO LONGER VALID: no template in config (see inline template case)

// fallbacks without other config
await new Orchestration().completion.create({
  fallbacks: [
    {
      model: 'amazon--nova-lite',
      messages: [{ role: 'assistant', content: 'You are a helpful assistant.' }]
    },
    {
      model: { name: 'amazon--nova-micro' },
      messages: [{ role: 'assistant', content: 'You are a helpful assistant.' }]
    }
  ],
  stream: true
});

// fallbacks with other config
await new Orchestration().completion
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
    fallbacks: [
      {
        model: 'amazon--nova-lite',
        messages: [
          { role: 'assistant', content: 'You are a helpful assistant.' }
        ]
      },

      {
        model: { name: 'amazon--nova-micro' },
        messages: [
          { role: 'assistant', content: 'You are a helpful assistant.' }
        ]
      }
    ],
    stream: true
  });

// config reference
await new Orchestration().completion
  .withModules({ id: 'ID' })
  .create({ stream: true });

// RAW JSON CONFIG as an object
await new Orchestration().completion.post({
  config: {
    modules: {
      prompt_templating: {
        model: { name: 'amazon--nova-lite' },
        prompt: {
          template: [
            { role: 'assistant', content: 'You are a helpful assistant.' }
          ]
        }
      }
    },
    stream: { enabled: true }
  }
});
