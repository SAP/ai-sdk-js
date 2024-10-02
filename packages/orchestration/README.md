# @sap-ai-sdk/orchestration

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Table of Contents

- [Installation](#installation)
  - [Prerequisites](#prerequisites)
- [Orchestration Service](#orchestration-service)
- [Usage](#usage)
  - [Templating](#templating)
    - [Token Usage](#token-usage)
  - [Content Filtering](#content-filtering)
    - [Data Masking](#data-masking)
  - [Custom Request Configuration](#custom-request-configuration)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/orchestration
```

### Prerequisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Project configured with Node.js v20 or higher and native ESM support enabled.
- An orchestration deployment is running.
  - Use the [`DeploymentApi`](../ai-api/README.md#deploymentapi) from `@sap-ai-sdk/ai-api` to create a deployment for orchestration to the SAP generative AI hub. For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-orchestration).
  - Once a deployment is complete, the orchestration service can be accessed via the `deploymentUrl`.

## Orchestration Service

The orchestration service provides essential features like templating and content filtering, which are often required in business AI scenarios:

- **Templating** allows composing prompts with placeholders that can be filled during a chat completion request.
- **Content filtering** lets you restrict the content sent to or received from a generative AI model.

Find more details about orchestration workflow [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration-workflow).

## Usage

Leverage the orchestration service capabilities by using the orchestration client.
Configure the LLM module by setting the `model_name` and `model_params` properties.
Define the optional `model_version` property to choose an available model version.
By default, the version is set to `latest`.

```ts
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4-32k',
    model_params: { max_tokens: 50, temperature: 0.1 },
    model_version: 'latest'
  },
  ...
});
```

The client allows you to combine various modules, such as templating and content filtering, while sending chat completion requests to an orchestration-compatible generative AI model.

### Templating

Use the orchestration client with templating to pass a prompt containing placeholders that will be replaced with input parameters during a chat completion request.
This allows for variations in the prompt based on the input parameters.
Set custom request configuration when calling `chatCompletion` function.

```ts
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4-32k',
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
    model_name: 'gpt-4-32k',
    model_params: { max_tokens: 50, temperature: 0.1 }
  },
  templating: {
    template: [{ role: 'user', content: 'What is my name?' }]
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
  ]
});
const responseContent = response.getContent();
```

#### Token Usage

To retrieve the token usage details of the orchestration request, use the following snippet:

```ts
const tokenUsage = response.getTokenUsage();

logger.info(
  `Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
    `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
    `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
);
```

Remember to initialize a logger before using it.

### Content Filtering

Use the orchestration client with filtering to restrict content that is passed to and received from a generative AI model.

This feature allows filtering both the [input](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-orchestration#content-filtering-on-input) and [output](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-orchestration#content-filtering-on-input) of a model based on content safety criteria.

```ts
import {
  OrchestrationClient,
  buildAzureContentFilter
} from '@sap-ai-sdk/orchestration';

const filter = buildAzureContentFilter({ Hate: 2, Violence: 4 });
const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4-32k',
    model_params: { max_tokens: 50, temperature: 0.1 }
  },
  templating: {
    template: [{ role: 'user', content: '{{?input}}' }]
  },
  filtering: {
    input: filter,
    output: filter
  }
});

try {
  const response = await orchestrationClient.chatCompletion({
    inputParams: { input: 'I hate you!' }
  });
  return response.getContent();
} catch (error: any) {
  return `Error: ${error.message}`;
}
```

`buildAzureContentFilter()` is a convenience function that creates an Azure content filter configuration based on the provided inputs.
The Azure content filter supports four categories: `Hate`, `Violence`, `Sexual`, and `SelfHarm`.
Each category can be configured with severity levels of 0, 2, 4, or 6.

#### Data Masking

You can anonymize or pseudonomize the prompt using the data masking capabilities of the orchestration service.

```ts
const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4-32k',
    model_params: {}
  },
  templating: {
    template: [
      {
        role: 'user',
        content:
          'Please write an email to {{?user}} ({{?email}}), informing them about the amazing capabilities of generative AI! Be brief and concise, write at most 6 sentences.'
      }
    ]
  },
  masking: {
    masking_providers: [
      {
        type: 'sap_data_privacy_integration',
        method: 'pseudonymization',
        entities: [{ type: 'profile-email' }, { type: 'profile-person' }]
      }
    ]
  }
});

const response = await orchestrationClient.chatCompletion({
  inputParams: { user: 'Alice Anderson', email: 'alice.anderson@sap.com' }
});
return response.getContent();
```

### Custom Request Configuration

Set custom request configuration in the `requestConfig` parameter when calling the `chatCompletion()` method.

```ts
const response = await orchestrationClient.chatCompletion(
  {
    ...
  },
  {
    headers: {
      'x-custom-header': 'custom-value'
      // Add more headers here
    },
    params: {
      // Add more parameters here
    }
    // Add more request configuration here
  }
);
```

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
