// oxlint-disable no-unused-vars
import { Orchestration } from './orchestration.ts';

// Questions:
// - prompt registry and models?
// - streaming with strings? extra function? (.stream())
// Usage???

const completion = new Orchestration().completion({
  promptTemplating: {
    model: { name: 'amazon--nova-lite' }
  }
});

await completion.create({
  prompt: [{ role: 'assistant', content: 'You are a helpful assistant.' }]
});

// OVERLOADED API
await new Orchestration()
  .completion({
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

await new Orchestration()
  .completion({
    promptTemplating: {
      model: { name: 'amazon--nova-lite' }
    }
  })
  .create({
    prompt: [{ role: 'assistant', content: 'You are a helpful assistant.' }],
    stream: true
  });

// NAMED API
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

await new Orchestration().completion
  .useConfigWithoutTemplate({
    promptTemplating: {
      model: { name: 'amazon--nova-lite' }
    }
  })
  .create({
    // TODO: Don't call this prompt - either template or messages
    prompt: [{ role: 'assistant', content: 'You are a helpful assistant.' }],
    stream: true
  });

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

//TODO: Either name+scenario+version or ID
await new Orchestration().completion
  .useConfigReference({ id: 'ID' })
  .create({ stream: true });

await new Orchestration().completion.create({
  modules: {
    promptTemplating: {
      model: { name: 'amazon--nova-lite' },
      prompt: {
        template: [
          { role: 'assistant', content: 'You are a helpful assistant.' }
        ]
      }
    }
  },
  stream: true
});

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

// RAW JSON CONFIG as a string (parsed and sent as-is)
await new Orchestration().completion.post(
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
    },
    "stream": { "enabled": true }
  }
}`,
  { stream: true }
);

// MERGED create: module config without a standing prompt, non-streaming
await new Orchestration().completion.create({
  modules: {
    promptTemplating: {
      model: { name: 'amazon--nova-lite' }
    }
  },
  prompt: [{ role: 'assistant', content: 'You are a helpful assistant.' }]
});

// MERGED create: config reference (fields passed directly, not under `modules`)
await new Orchestration().completion.create({
  id: 'ID',
  stream: true
});
