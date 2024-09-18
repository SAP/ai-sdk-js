# @sap-ai-sdk/orchestration

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Installation

```
$ npm install @sap-ai-sdk/orchestration
```

## Pre-requisites

- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Project configured with Node.js v20 or higher and native ESM support enabled.
- For testing your application locally:
  - Download a service key for your AI Core service instance.
  - Create a `.env` file in the sample-code directory.
  - Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`.

## Orchestration client

Orchestration combines content generation with a set of functions like templating and content filtering that are often required in business AI scenarios.

Templating lets you compose a prompt with placeholders that are filled during the chat completion request.
Content filtering lets you restrict the type of content that is passed to and received from a generative AI model.

The Orchestration client allows you to send chat completion requests to generative AI models that are compatible with the orchestration service.
More details about Orchestration can be found [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration-workflow).

To make use of the orchestration capabilities, you need to create a deployment.
After the deployment is complete, you have a `deploymentUrl`, which can be used to access the orchestration service.
Further details about creating a deployment for the Orchestration can be found [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-orchestration)

### Prerequisites

- At least one orchestration-compatible deployment for a generative AI model is running.
  - You can use the [`DeploymentApi`](../ai-api/README.md#deploymentapi) from `@sap-ai-sdk/ai-api` to deploy a model to SAP generative AI hub. For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core)
- A deployment is created for Orchestration. For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-orchestration)
- `sap-ai-sdk/orchestration` package installed in your project.

### Usage of Orchestration Client

Use the `OrchestrationClient` to configure different modules like templating, content filtering etc. along with sending chat completion requests to an orchestration compatible generative AI model.

You can pass configuration information like for example the LLM to be used for inference and template as a parameter to the client.

#### Orchestration client with Templating

```TS
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

#### Orchestration client with Content Filtering

```TS

import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const filter = azureContentFilter({ Hate: 0, Violence: 0 });
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
    // Call the orchestration service.
    const response = await orchestrationClient.chatCompletion({
      inputParams: { input: 'I hate you!' }
    });
    // Access the response content.
    return response.getContent();
  } catch (error: any) {
    // Handle the case where the output was filtered.
    return `Error: ${error.message}`;
  }

```

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)