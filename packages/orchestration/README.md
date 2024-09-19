# @sap-ai-sdk/orchestration

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Installation

```
$ npm install @sap-ai-sdk/orchestration
```

## Orchestration Client

The orchestration client provides essential features like templating and content filtering, which are often required in business AI scenarios:

- **Templating** allows composing prompts with placeholders that can be filled during a chat completion request.
- **Content filtering** lets you restrict the content sent to or received from a generative AI model.

To interact with generative AI models compatible with the orchestration service, use the orchestration client.
Find more details about orchestration [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration-workflow).

To utilize orchestration capabilities, you need to create a deployment.
Once the deployment is complete, you'll have a `deploymentUrl` to access the orchestration service.
For details, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-orchestration).

### Prerequisites

- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Project configured with Node.js v20 or higher and native ESM support enabled.
- For testing the application locally (Optional):
  - Download a service key for your AI Core service instance.
  - Create a `.env` file in the sample-code directory.
  - Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`.
- At least one orchestration-compatible deployment for a generative AI model is running.
  - You can use the [`DeploymentApi`](../ai-api/README.md#deploymentapi) from `@sap-ai-sdk/ai-api` to deploy a model to the SAP generative AI hub. For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
- A deployment for orchestration is created. For details, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-orchestration). If deployment for orchestration already exists, skip this step.
- The `@sap-ai-sdk/orchestration` package is installed in your project.

### Orchestration Client

Use the orchestration client to configure different modules like templating and content filtering along with sending chat completion requests to an orchestration compatible generative AI model.

#### Templating

Use the orchestration client with templating to pass a prompt with placeholders that are replaced with input parameters during a chat completion request.

You can vary the prompt based on the input parameters.

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

It is possible to provide a history of a conversation to the model.
Use the following snippet to send a chat completion request with history and a system message:

```TS
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const orchestrationClient = new OrchestrationClient({
  llm: {
    model_name: 'gpt-4-32k',
    model_params: { max_tokens: 50, temperature: 0.1 }
  },
  templating: {
    template: [
      { role: 'user', content: 'What is my name?' }
    ]
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
const tokenUsage = response.getTokenUsage();

logger.info(
  `Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
  `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
  `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
);
```

#### Content Filtering

Use the orchestration client with filtering to restrict content that is passed to and received from a generative AI model.

This feature allows filtering both the [input](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-orchestration#content-filtering-on-input) and [output](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-orchestration#content-filtering-on-input) of a model based on content safety criteria.

```TS
import { OrchestrationClient, buildAzureContentFilter } from '@sap-ai-sdk/orchestration';

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

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
