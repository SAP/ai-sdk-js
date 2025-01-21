# @sap-ai-sdk/orchestration

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Orchestration Service](#orchestration-service)
- [Relationship between Orchestration and Resource Groups](#relationship-between-orchestration-and-resource-groups)
- [Usage](#usage)
  - [Templating](#templating)
  - [Content Filtering](#content-filtering)
  - [Data Masking](#data-masking)
  - [Grounding](#grounding)
  - [Using a JSON Configuration from AI Launchpad](#using-a-json-configuration-from-ai-launchpad)
  - [Streaming](#streaming)
  - [Using Resource Groups](#using-resource-groups)
  - [Custom Request Configuration](#custom-request-configuration)
  - [Custom Destination](#custom-destination)
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

> **Accessing the AI Core Service via the SDK**
>
> The SDK automatically retrieves the `AI Core` service credentials and resolves the access token needed for authentication.
>
> - In Cloud Foundry, it's accessed from the `VCAP_SERVICES` environment variable.
> - In Kubernetes / Kyma environments, you have to mount the service binding as a secret instead, for more information refer to [this documentation](https://www.npmjs.com/package/@sap/xsenv#usage-in-kubernetes).

## Orchestration Service

The orchestration service provides essential features like [templating](#templating), [content filtering](#content-filtering), [grounding](#grounding), etc which are often required in business AI scenarios.

Find more details about orchestration workflow [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration-workflow).

## Relationship between Orchestration and Resource Groups

SAP AI Core manages access to orchestration of generative AI models through the global AI scenario `orchestration`.
Creating a deployment for enabling orchestration capabilities requires access to this scenario.

[Resource groups](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) represent a virtual collection of related resources within the scope of one SAP AI Core tenant.
Each resource group allows for a one-time orchestration deployment.

Consequently, each orchestration deployment uniquely maps to a resource group within the `orchestration` scenario.

## Usage

Leverage the orchestration service capabilities by using the orchestration client.
Configure the LLM module by setting the `model_name` property.
Define the optional `model_version` property to choose an available model version.
By default, the version is set to `latest`.
Specify the optional `model_params` property to apply specific parameters to the model

```ts
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o',
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
    model_name: 'gpt-4o',
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

#### Image Recognition

Many models in the orchestration service have image recognition capabilities, meaning the models can take images and answer questions about them.

```ts
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o'
  },
  templating: {
    template: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is the content of the image?'
          },
          {
            type: 'image_url',
            image_url: {
              url: '{{?imageUrl}}'
            }
          }
        ]
      }
    ]
  }
});

const response = await orchestrationClient.chatCompletion({
  inputParams: {
    imageUrl: 'IMAGE_URL'
  }
});
```

`IMAGE_URL` can either be a public URL or a base64 encoded image, e.g., `data:image/jpeg;base64,...`.
The model can take multiple images.
It will process each image and use the information from all of them to answer the question.

### Content Filtering

Use the orchestration client with filtering to restrict content that is passed to and received from a generative AI model.

This feature allows filtering both the [input](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-orchestration#content-filtering-on-input) and [output](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-orchestration#content-filtering-on-input) of a model based on content safety criteria.

```ts
import {
  OrchestrationClient,
  buildAzureContentFilter
} from '@sap-ai-sdk/orchestration';

const filter = buildAzureContentFilter({
  Hate: AzureFilterThreshold.ALLOW_SAFE_LOW,
  Violence: AzureFilterThreshold.ALLOW_SAFE_LOW_MEDIUM
});
const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o',
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
Each category can be configured with severity levels of `ALLOW_SAFE`, `ALLOW_SAFE_LOW`, `ALLOW_SAFE_LOW_MEDIUM` and `ALLOW_ALL` which correspond to Azure threshold values of 0, 2, 4, or 6 respectively.

### Data Masking

You can anonymize or pseudonomize the prompt using the data masking capabilities of the orchestration service.

```ts
const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o'
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

### Grounding

Grounding enables integrating external, contextually relevant, domain-specific, or real-time data into AI processes.
The grounding configuration can be provided as a raw JSON object or by using the `buildDocumentGroundingConfig()` function, which requires only the minimal mandatory values.

```ts
const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-35-turbo'
  },
  templating: {
    template: [
      {
        role: 'user',
        content:
          'UserQuestion: {{?groundingRequest}} Context: {{?groundingOutput}}'
      }
    ],
    defaults: {}
  },
  grounding: buildDocumentGroundingConfig(
    input_params: ['groundingRequest'],
    output_param: 'groundingOutput',
    filters: [
        {
          id: 'filter1',
          data_repositories: ['repository-id']
        }
      ],
    )
});

const response = await orchestrationClient.chatCompletion({
  inputParams: { groundingRequest: 'What is Generative AI Hub in SAP AI Core?' }
});
return response.getContent();
```

### Using a JSON Configuration from AI Launchpad

If you already have an orchestration workflow created in AI Launchpad, you can either download the configuration as a JSON file or copy the JSON string directly to use it with the orchestration client.

```ts
const jsonConfig = await fs.promises.readFile(
  'path/to/orchestration-config.json',
  'utf-8'
);
// Alternatively, you can provide the JSON configuration as a plain string in the code directly.
// const jsonConfig = 'YOUR_JSON_CONFIG'

const response = await new OrchestrationClient(jsonConfig).chatCompletion();

return response;
```

### Streaming

The `OrchestrationClient` supports streaming responses for chat completion requests based on the [Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) standard.

Use the `stream()` method to receive a stream of chunk responses from the model.
After consuming the stream, call the helper methods to get the finish reason and token usage information.

```ts
const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o',
    model_params: { max_tokens: 50, temperature: 0.1 }
  },
  templating: {
    template: [
      { role: 'user', content: 'Give a long history of {{?country}}?' }
    ]
  }
});

const response = await orchestrationClient.stream({
  inputParams: { country: 'France' }
});

for await (const chunk of response.stream) {
  console.log(JSON.stringify(chunk));
}

const finishReason = response.getFinishReason();
const tokenUsage = response.getTokenUsage();

console.log(`Finish reason: ${finishReason}\n`);
console.log(`Token usage: ${JSON.stringify(tokenUsage)}\n`);
```

#### Streaming the Delta Content

The client provides a helper method to extract the text chunks as strings:

```ts
for await (const chunk of response.stream.toContentStream()) {
  console.log(chunk); // will log the delta content
}
```

Each chunk will be a string containing the delta content.

#### Streaming with Abort Controller

Streaming request can be aborted using the `AbortController` API.
In case of an error, the SAP Cloud SDK for AI will automatically close the stream.
Additionally, it can be aborted manually by calling the `stream()` method with an `AbortController` object.

```ts
const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4o',
    model_params: { max_tokens: 50, temperature: 0.1 }
  },
  templating: {
    template: [
      { role: 'user', content: 'Give a long history of {{?country}}?' }
    ]
  }
});

const controller = new AbortController();
const response = await orchestrationClient.stream(
  {
    inputParams: { country: 'France' }
  },
  controller
);

// Abort the streaming request after one second
setTimeout(() => {
  controller.abort();
}, 1000);

for await (const chunk of response.stream) {
  console.log(JSON.stringify(chunk));
}
```

In this example, streaming request will be aborted after one second.
Abort controller can be useful, e.g., when end-user wants to stop the stream or refreshes the page.

#### Stream Options

The orchestration service offers multiple streaming options, which you can configure in addition to the LLM's streaming options.
These include options like definining the maximum number of characters per chunk or modifying the output filter behavior.
There are two ways to add specific streaming options to your client, either at initialization of orchestration client, or when calling the stream API.

Setting streaming options dynamically could be useful if an initialized orchestration client will also be used for streaming.

You can check the list of available stream options in the [orchestration service's documentation](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/streaming).

An example for setting the streaming options when calling the stream API looks like the following:

```ts
const response = orchestrationClient.stream(
  {
    inputParams: { country: 'France' }
  },
  controller,
  {
    llm: { include_usage: false },
    global: { chunk_size: 10 },
    outputFiltering: { overlap: 200 }
  }
);
```

Usage metrics are collected by default, if you do not want to receive them, set `include_usage` to `false`.
If you don't want any streaming options as part of your call to the LLM, set `streamOptions.llm` to `null`.

> [!NOTE]
> When initalizing a client with a JSON module config, providing streaming options is not possible.

### Using Resource Groups

The resource group can be used as an additional parameter to pick the right orchestration deployment.

```ts
const orchestrationClient = new OrchestrationClient(
  {
    llm: {
      model_name: 'gpt-4p',
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

### Custom Destination

When initializing the `OrchestrationClient` client, it is possible to provide a custom destination.
For example, when targeting a destination with the name `my-destination`, the following code can be used:

```ts
const orchestrationClient = new OrchestrationClient(
  {
    llm,
    templating
  },
  {
    resourceGroup: 'default'
  },
  {
    destinationName: 'my-destination'
  }
);
```

By default, the fetched destination is cached.
To disable caching, set the `useCache` parameter to `false` together with the `destinationName` parameter.

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
