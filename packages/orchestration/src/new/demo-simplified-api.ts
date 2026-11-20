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
  promptConfigs: [
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
    promptConfigs: [
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
  .withConfigRef({ id: 'ID' })
  .withModules({
    filtering: { input: { filters: [{ type: 'azure_content_safety' }] } }
  })
  .create({
    model: 'amazon--nova-lite',
    messages: [{ role: 'assistant', content: 'You are a helpful assistant.' }],
    stream: true
  });

// config reference, stored configuration unchanged
await new Orchestration().completion
  .withConfigRef({ id: 'ID' })
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

// RAW JSON CONFIG as a string (unparsed and sent as-is)
// await new Orchestration().completion.postStream(
//   `{
//   "config": {
//     "modules": {
//       "prompt_templating": {
//         "model": { "name": "amazon--nova-lite" },
//         "prompt": {
//           "template": [
//             { "role": "assistant", "content": "You are a helpful assistant." }
//           ]
//         }
//       }
//     },
//     stream: { enabled: true }
//   }
// }`
// );

// TODO: check for fallbacks, if you can have equally long lists
// TODO: config_ref => new function+ overrides + scenario vs. id
