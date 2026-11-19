// oxlint-disable no-unused-vars
import { Orchestration } from './orchestration.ts';

// inline template in config
await new Orchestration().completion
  .useConfigWithTemplate({
    promptTemplating: {
      model: { name: 'amazon--nova-lite' },
      prompt: {
        template: [
          { role: 'assistant', content: 'You are a helpful assistant.' }
        ]
      }
    }
  })
  .create({ stream: true });

// template ref in config
await new Orchestration().completion
  .useConfigWithTemplate({
    promptTemplating: {
      model: { name: 'amazon--nova-lite' },
      prompt: { template_ref: { id: 'ID' } }
    }
  })
  .create({
    stream: true
  });

// no template in config
await new Orchestration().completion
  .useConfigWithoutTemplate({
    promptTemplating: {
      model: { name: 'amazon--nova-lite' }
    }
  })
  .create({
    messages: [{ role: 'assistant', content: 'You are a helpful assistant.' }],
    stream: true
  });

// fallbacks
await new Orchestration().completion
  .useFallbacks([
    {
      promptTemplating: {
        model: { name: 'amazon--nova-lite' },
        prompt: {
          template: [
            { role: 'assistant', content: 'You are a helpful assistant.' }
          ]
        }
      }
    },

    {
      promptTemplating: {
        model: { name: 'amazon--nova-micro' },
        prompt: {
          template: [
            { role: 'assistant', content: 'You are a helpful assistant.' }
          ]
        }
      }
    }
  ])
  .create({ stream: true });

// config reference
await new Orchestration().completion
  .useConfigReference({ id: 'ID' })
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
await new Orchestration().completion
  .useRawJsonConfig(
    `{
  "config": {
    "modules": {
      "prompt_templating": {
        "model": { "name": "amazon--nova-lite" },
        "prompt": {
          "template": [
            { "role": "assistant", "content": "You are a helpful assistant." }
          ]
        }
      }
    }
  }
}`
  )
  .create({ stream: true });

//TODO: config-ref: Either name+scenario+version or ID
