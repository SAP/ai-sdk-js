# @sap-ai-sdk/orchestration

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Orchestration Service](#orchestration-service)
- [Relationship between Orchestration and Resource Groups](#relationship-between-orchestration-and-resource-groups)
- [Usage](#usage)
  - [Templating](#templating)
  - [Content Filtering](#content-filtering)
  - [Data Masking](#data-masking)
  - [Using Resource Groups](#using-resource-groups)
  - [Custom Request Configuration](#custom-request-configuration)
- [Local Testing](#local-testing)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/orchestration
```

## Prerequisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Configure the project with **Node.js v20 or higher** and **native ESM** support.
- Ensure an orchestration deployment is available in the SAP Generative AI Hub.
  - Use the [`DeploymentApi`](https://github.com/SAP/ai-sdk-js/blob/main/packages/ai-api/README.md#create-a-deployment) from `@sap-ai-sdk/ai-api` [to create a deployment](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-orchestration).
    Alternatively, you can also create deployments using the [SAP AI Launchpad](https://help.sap.com/docs/sap-ai-core/generative-ai-hub/activate-generative-ai-hub-for-sap-ai-launchpad?locale=en-US&q=launchpad).
  - Once the deployment is complete, access the orchestration service via the `deploymentUrl`.

> **Accessing the AI Core Service via the SDK**:
> The SDK automatically retrieves the `AI Core` service credentials and resolves the access token needed for authentication.
>   In Cloud Foundry, it's accessed from the `VCAP_SERVICES` environment variable
>   In Kubernetes / Kyma environments, you have to mount the service binding as a secret instead, for more information refer to [this documentation](https://www.npmjs.com/package/@sap/xsenv#usage-in-kubernetes).

## Orchestration Service

The orchestration service provides essential features like templating and content filtering, which are often required in business AI scenarios:

- **Templating** allows composing prompts with placeholders that can be filled during a chat completion request.
- **Content filtering** lets you restrict the content sent to or received from a generative AI model.

Find more details about orchestration workflow [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration-workflow).

## Relationship between Orchestration and Resource Groups

SAP AI Core manages access to orchestration of generative AI models through the global AI scenario `orchestration`.
Creating a deployment for enabling orchestration capabilities requires access to this scenario.

[Resource groups](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) represent a virtual collection of related resources within the scope of one SAP AI Core tenant.
Each resource group allows for a one-time orchestration deployment.

Consequently, each orchestration deployment uniquely maps to a resource group within the `orchestration` scenario.

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

In addition to the examples below, you can find more **sample code** [here](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/src/orchestration.ts).

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

`getContent()` is a convenience method that parses the response and returns the model's output as a string.

To retrieve the `finish_reason` for stopping the chat completion request, use the convenience method `getFinishReason()`:

```ts
const finishReason = response.getFinishReason();
```

Use the `getTokenUsage()` convenience method to retrieve the token usage details of the chat completion request:

```ts
const tokenUsage = response.getTokenUsage();

console.log(
  `Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
    `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
    `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
);
```

> [!Tip]
>
> #### Harmonized API
>
> As the orchestration service API is harmonized, you can switch to a different model, even from another vendor, by changing only the `model_name` property.
> Here’s an example where only one line of code is changed.
>
> ```ts
> const orchestrationClient = new OrchestrationClient({
>   llm: {
>     // only change the model name here
>     model_name: 'gemini-1.5-flash',
>     model_params: { max_tokens: 50, temperature: 0.1 }
>   },
>   templating: {
>     template: [
>       { role: 'user', content: 'What is the capital of {{?country}}?' }
>     ]
>   }
> });
> ```

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

Both `chatCompletion()` and `getContent()` methods can throw errors.

- **axios errors**:  
  When the chat completion request fails with a `400` status code, the caught error will be an `Axios` error.
  The property `error.response.data.message` may provide additional details about the failure's cause.

- **output content filtered**:  
  The method `getContent()` can throw an error if the output filter filters the model output.
  This can occur even if the chat completion request responds with a `200` HTTP status code.
  The `error.message` property indicates if the output was filtered.

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

The relationship between orchestration and resource groups is explained [here](#relationship-between-orchestration-and-resource-groups).

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

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
