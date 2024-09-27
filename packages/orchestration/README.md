# @sap-ai-sdk/orchestration

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Orchestration Service](#orchestration-service)
- [Relationship between Orchestration and Resource Groups](#relationship-between-orchestration-and-resource-groups)
- [Usage](#usage)
  - [Templating](#templating)
  - [Content Filtering](#content-filtering)
  - [Data Masking](#data-masking)
  - [Retrieving Data from the Response](#retrieving-data-from-the-response)
    - [Finish Reason](#finish-reason)
    - [Token Usage](#token-usage)
    - [Using Resource Groups](#using-resource-groups)
- [Local Testing](#local-testing)
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

## Relationship between Orchestration and Resource Groups

Access to orchestration of generative AI models is provided under the global AI scenario `orchestration`, which is managed by SAP AI Core.
A deployment can be created to enable orchestration capabilities only with access to the global AI scenario `orchestration`.
[Resource groups](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) represent a virtual collection of related resources within the scope of one SAP AI Core tenant.
Each resource group allows for a one-time orchestration deployment.

Consequently, each orchestration deployment uniquely maps to a resource group within the `orchestration` scenario.

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

`response.getContent()` is a convenience method that parses the response and returns the model's output as a string.

#### Customizing the Request Configuration

To customize the request configuration, for example to pass additional headers to the client, use the second parameter in the `chatCompletion()` method:

```ts
const response = await orchestrationClient.chatCompletion(
  {
    inputParams: { country: 'France' }
  },
  {
    headers: { 'x-custom-header': 'custom-value' }
  }
);
```

#### Passing a Message History

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

In the above code snippet, both `orchestrationClient.chatCompletion()` and `response.getContent()` can throw errors.

- **Axios Errors**:  
  When the chat completion request fails with a `400` status code, the caught error will be an `Axios` error. The property `error.response.data.message` may provide additional details about the failure's cause.

- **Output Content Filtered**:  
  The method `response.getContent()` can throw an error if the content filter configuration filters the output. This situation can occur even if the initial request succeeds. The `error.message` property indicates whether the output was filtered.

Therefore, handle errors appropriately to ensure meaningful feedback for both types of errors.

`buildAzureContentFilter()` is a convenience function that creates an Azure content filter configuration based on the provided inputs.
The Azure content filter supports four categories: `Hate`, `Violence`, `Sexual`, and `SelfHarm`.
Each category can be configured with severity levels of 0, 2, 4, or 6.

### Data Masking

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

### Retrieving Data from the Response

In addition to `getContent()`, other available convenience methods can retrieve the finish reason and token usage.
Use `response.rawReason` to access the complete HTTP response from the orchestration service.

#### Finish Reason

The finish reason indicates the reason for stopping the chat completion request.
For example, when output is filtered based on the configuration, the finish reason is `content_filter`.

```ts
const finishReason = response.getFinishReason();
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

### Using Resource Groups

The resource group can be used as an additional parameter to pick the right orchestration deployment.

```ts
const orchestrationClient = new OrchestrationClient(
  {
    llm: {
      model_name: 'gpt-4-32k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    templating: {
      template: [{ role: 'user', content: 'What is my name?' }]
    }
  },
  { resourceGroup: 'rg1234' }
);
```

## Local Testing

For local testing instructions, refer to this [section](../../README.md#local-testing).

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
