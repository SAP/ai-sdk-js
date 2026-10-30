# @sap-ai-sdk/ai-api

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides tools to manage scenarios and workflows in SAP AI Core.

- Streamline data preprocessing and model training pipelines.
- Execute batch inference jobs.
- Deploy inference endpoints for trained models.
- Register custom Docker registries, sync AI content from Git repositories, and register object storage for training data and model artifacts.
- **Discover available models on Gen AI Hub**, query their capabilities, and resolve deployment IDs.

We maintain a list of [currently available and tested AI Core APIs](https://github.com/SAP/ai-sdk-js/blob/main/docs/list-tested-APIs.md)

### Table of Contents

- [Installation](#installation)
- [Model Discovery](#model-discovery)
- [Documentation](#documentation)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```bash
npm install @sap-ai-sdk/ai-api
```

## Model Discovery

Use the convenience helpers to discover available models on Gen AI Hub and query their capabilities.

### List Available Models

```ts
import { getModels } from '@sap-ai-sdk/ai-api';

const models = await getModels();
// models is AiModelBaseData[] with name, provider, versions, capabilities, etc.
```

By default, `getModels()` queries the `foundation-models` scenario, which covers all LLM models available on Gen AI Hub.
Pass `scenarioId` to query a different scenario, or `resourceGroup` to target a non-default resource group.

### Filter by Capability

```ts
import {
  getModels,
  filterByOrchestrationCapability,
  filterByCapability
} from '@sap-ai-sdk/ai-api';

const models = await getModels();

// Models usable via the orchestration service for chat
const chatModels = filterByOrchestrationCapability(models, 'chat');

// Models with vision (image input) capability
const visionModels = filterByCapability(models, 'vision');
```

### Filter Deprecated Models

```ts
import {
  getModels,
  filterNonDeprecated,
  getLatestVersions
} from '@sap-ai-sdk/ai-api';

const models = await getModels();

// Remove deprecated versions; exclude models with no active versions left
const activeModels = filterNonDeprecated(models);

// Get just the latest version info per model
const latestVersions = getLatestVersions(models);
// [{ model: 'gpt-4o', executableId: 'azure-openai', latestVersion: { name: '2024-11-20', ... } }]
```

### Resolve a Deployment ID

```ts
import { getFoundationModelDeploymentId } from '@sap-ai-sdk/ai-api';

const deploymentId = await getFoundationModelDeploymentId(
  'gpt-4o',
  'azure-openai'
);
```

> To use foundation models directly, see [`@sap-ai-sdk/foundation-models`](../foundation-models/README.md).
> To use models through the orchestration service, see [`@sap-ai-sdk/orchestration`](../orchestration/README.md).

## Documentation

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
