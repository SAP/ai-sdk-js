# @sap-ai-sdk/langchain

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides LangChain clients built on top of the foundation model and orchestration clients of the SAP Cloud SDK for AI.

### Table of Contents

- [Installation](#installation)
- [Direct OpenAI access with LangChain](#direct-openai-access-with-langchain)
- [Documentation](#documentation)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```bash
# Install langchain
npm install langchain @langchain/core

# Install SAP Cloud SDK for AI langchain package
npm install @sap-ai-sdk/langchain
```

## Direct OpenAI access with LangChain

The `@sap-ai-sdk/langchain/openai` entry point provides a factory and a configuration helper for direct access to OpenAI deployments through SAP AI Core using the upstream `@langchain/openai` package.
These helpers are experimental. Install the optional peer dependency to use them:

```bash
npm install @langchain/openai openai
```

Use the factory for a configured upstream `ChatOpenAI` model, including features such as the Responses API:

```ts
import { createChatOpenAi } from '@sap-ai-sdk/langchain/openai';

const model = await createChatOpenAi('gpt-5.4', {
  useResponsesApi: true
});
const response = await model.invoke('What is the capital of France?');
```

Use the configuration helper when constructing `ChatOpenAI` or `OpenAIEmbeddings` yourself:

```ts
import { createLangChainOpenAiConfig } from '@sap-ai-sdk/langchain/openai';

import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',
  configuration: await createLangChainOpenAiConfig('text-embedding-3-small')
});
```

Both helpers accept a model name or the full `@sap-ai-sdk/openai` options, including deployment ID, model version, resource group, destination, API version, and client type.
They handle deployment resolution, refreshing bearer authentication, API-version queries, and SAP headers without requiring callers to wire up a token provider.
The main `@sap-ai-sdk/langchain` entry point does not load `@langchain/openai`.

## Documentation

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
