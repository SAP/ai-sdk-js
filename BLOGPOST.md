# Introducing the SAP Cloud SDK for AI (JavaScript/TypeScript) 🎉

We are excited to announce the initial release of the [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js#readme)! It simplifies the integration of generative AI capabilities into your SAP Business Technology Platform (BTP) applications.

The SDK allows you to leverage the SAP AI Core and SAP AI Launchpad, enabling capabilities like templating, grounding, data masking, and more. In this blog post, we’ll introduce you to the key packages and their features.

## Key Features
### AI Orchestration with `@sap-ai-sdk/orchestration`
The [@sap-ai-sdk/orchestration](https://github.com/SAP/ai-sdk-js/tree/main/packages/orchestration#readme) package enables generative AI orchestration, allowing you to configure templating, content filtering, and data masking for your applications. With its orchestration service, you can streamline workflows and manage AI models within SAP AI Core.

- **Templating**: Create dynamic prompts with placeholders to customize AI interactions based on user inputs.
- **Content Filtering**: Apply filters to ensure input and output adhere to content safety guidelines.
- **Data Masking**: Anonymize sensitive information with data masking features.

### AI Management with `@sap-ai-sdk/ai-api`
The [@sap-ai-sdk/ai-api](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#readme) package provides comprehensive tools for managing scenarios and workflows in SAP AI Core. You can automate processes such as creating artifacts, configurations, and deployments; executing batch inference jobs; and managing Docker registries and object storage for training data.

- **[Artifact Management](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#create-an-artifact)**: Register and manage datasets and other model artifacts.
- **[Configuration Management](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#create-a-configuration)**: Set up configurations for different models and use cases.
- **[Deployment Management](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#create-a-deployment)**: Deploy AI models and manage their lifecycle within SAP AI Core.

### LangChain Integration with `@sap-ai-sdk/langchain`
The [@sap-ai-sdk/langchain](https://github.com/SAP/ai-sdk-js/tree/main/packages/langchain#readme) package provides LangChain-compatible clients for Azure OpenAI models deployed in SAP AI Core, enabling sophisticated AI pipelines within your SAP BTP applications.

- **Seamless Integration**: Built on SAP Cloud SDK for AI's foundation model clients, ensuring compatibility with SAP AI Core and LangChain's ecosystem.
- **Flexible Clients**: Easily initialize chat and embedding clients with support for advanced features like templating and output parsing.
- **RAG Support**: Implement Retrieval-Augmented Generation workflows by combining embedding capabilities with LangChain's text splitters and vector stores.

### Generative AI with `@sap-ai-sdk/foundation-models`
The [@sap-ai-sdk/foundation-models](https://github.com/SAP/ai-sdk-js/tree/main/packages/foundation-models#readme) package offers streamlined access to specific generative AI models deployed in SAP AI Core and SAP AI Launchpad. It provides a more focused interface compared to the full orchestration capabilities, concentrating on direct model interactions.

This package is ideal for developers who need direct access to foundation models without the additional layers of orchestration, content filtering, or data masking provided by the orchestration service.

## Getting Started
To explore these packages further, check out our [sample project](https://github.com/SAP/ai-sdk-js/tree/main/sample-code#readme) demonstrating the usage of various SDK packages.

## Your Feedback Matters
We value your feedback on this initial release! Share your thoughts or ideas in the [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).
