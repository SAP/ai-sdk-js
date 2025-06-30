!!! The below information is only a snapshot of our documentation, used for the purpose of the sample code.
For the up-to-date documentation, please refer to the [official documentation](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md). !!!

## Orchestration Service

The orchestration service provides essential features like templating and content filtering, which are often required in business AI scenarios:

- **Templating** allows composing prompts with placeholders that can be filled during a chat completion request.
- **Content filtering** lets you restrict the content sent to or received from a generative AI model.

Find more details about orchestration workflow [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration-workflow).

## Usage

Leverage the orchestration service capabilities by using the orchestration client.
The client allows you to configure various modules, such as templating and content filtering, while sending chat completion requests to an orchestration-compatible generative AI model.

### Templating

Use the orchestration client with templating to pass a prompt containing placeholders that will be replaced with input parameters during a chat completion request.
This allows for variations in the prompt based on the input parameters.

```ts
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o',
    model_params: { max_tokens: 50, temperature: 0.1 }
  },
  templating: {
    template: [
      { role: 'user', content: 'What is the capital of {{?country}}?' }
    ]
  }
});

const response = await orchestrationClient.chatCompletion({
  inputParams: { country: 'France' }
});

const responseContent = response.getContent();
```

It is possible to provide a history of a conversation to the model.
Use the following snippet to send a chat completion request with history and a system message:

```ts
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o',
    model_params: { max_tokens: 50, temperature: 0.1 }
  }
});

const response = await orchestrationClient.chatCompletion({
  messagesHistory: [
    {
      role: 'system',
      content:
        'You are a helpful assistant who remembers all details the user shares with you.'
    },
    {
      role: 'user',
      content: 'Hi! Im Bob'
    },
    {
      role: 'assistant',
      content:
        "Hi Bob, nice to meet you! I'm an AI assistant. I'll remember that your name is Bob as we continue our conversation."
    }
  ],
  messages: [{ role: 'user', content: 'What is my name?' }]
});
const responseContent = response.getContent();
```
