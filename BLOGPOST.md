# Introducing the SAP Cloud SDK for AI (JavaScript/TypeScript) 🎉

We are excited to announce the initial release of the [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js#readme).
Integrate generative AI capabilities into your SAP Business Technology Platform (BTP) applications and leverage [SAP AI Core](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/what-is-sap-ai-core) as well as [SAP AI Launchpad](https://help.sap.com/docs/ai-launchpad/sap-ai-launchpad-user-guide/using-sap-ai-launchpad?locale=en-US).
In this blog post, we'll introduce you to the key packages and their features.

## AI Orchestration with `@sap-ai-sdk/orchestration`

Leverage the generative AI Hub orchestration service and configure templating, content filtering, and data masking for your applications with the [@sap-ai-sdk/orchestration](https://github.com/SAP/ai-sdk-js/tree/main/packages/orchestration#readme) package.
With the orchestration service, you can streamline AI interactions and ensure compliance with content safety guidelines.

- **[Templating](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md#templating)**: Create dynamic prompts with placeholders to customize AI interactions based on user inputs.
- **[Content Filtering](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md#content-filtering)**: Apply filters to ensure input and output adhere to content safety guidelines.
- **[Data Masking](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md#data-masking)**: Anonymize and pseudonymize sensitive information with data masking features.

## AI Management with `@sap-ai-sdk/ai-api`

The [@sap-ai-sdk/ai-api](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#readme) package provides comprehensive tools for managing scenarios and workflows in SAP AI Core.
You can automate processes such as creating artifacts, configurations, and deployments, executing batch inference jobs, and managing Docker registries as well as object storage for training data.

- **[Artifact Management](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#create-an-artifact)**: Register and manage datasets and other model artifacts.
- **[Configuration Management](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#create-a-configuration)**: Set up configurations for different models and use cases.
- **[Deployment Management](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#create-a-deployment)**: Deploy AI models and manage their lifecycle within SAP AI Core.

## LangChain Integration with `@sap-ai-sdk/langchain`

The [@sap-ai-sdk/langchain](https://github.com/SAP/ai-sdk-js/tree/main/packages/langchain#readme) package provides LangChain-compatible clients for Azure OpenAI models deployed in SAP AI Core, enabling sophisticated AI pipelines within your SAP BTP applications.

- **Seamless Integration**: Built on SAP Cloud SDK for AI's foundation model clients, ensuring compatibility with SAP AI Core and LangChain's ecosystem.
- **Flexible Clients**: Easily initialize chat and embedding clients with support for advanced features like templating and output parsing.
- **RAG Support**: Implement [Retrieval-Augmented Generation workflows](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/src/langchain-azure-openai.ts#L65) by combining embedding capabilities with LangChain's text splitters and vector stores.

## Generative AI with `@sap-ai-sdk/foundation-models`

The [@sap-ai-sdk/foundation-models](https://github.com/SAP/ai-sdk-js/tree/main/packages/foundation-models#readme) package offers streamlined access to specific generative AI models deployed in SAP AI Core and SAP AI Launchpad.
It provides a more focused interface compared to the full orchestration capabilities, concentrating on direct model interactions.

This package is ideal for developers who need direct access to foundation models for inference and embedding requests without the additional layers of templating, content filtering, or data masking provided by the orchestration service.

## Getting Started

To use the packages, you will need Node v20 or higher, as well as an ESM (ECMAScript Modules) compatible application.

To explore these packages further, check out our [sample code](https://github.com/SAP/ai-sdk-js/tree/main/sample-code#readme), that shows the usage of the various SDK packages.

## Support and Feedback

We value your feedback on this initial release!
If you need support or want to share your thoughts and ideas, go ahead and open an issue on [GitHub](https://github.com/SAP/ai-sdk-js/issues).
