# Introducing the SAP Cloud SDK for AI (JavaScript/TypeScript) 🎉

We are excited to announce the initial release of the [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js#readme)! This SDK simplifies the integration of generative AI capabilities into your SAP Business Technology Platform (BTP) applications.

The SDK allows you to leverage the SAP AI Core and SAP AI Launchpad, enabling capabilities like templating, grounding, data masking, and more. In this blog post, we’ll introduce you to the key packages and their features.

## Key Features

### AI Orchestration with `@sap-ai-sdk/orchestration`
The [@sap-ai-sdk/orchestration](https://github.com/SAP/ai-sdk-js/tree/main/packages/orchestration#readme) package enables generative AI orchestration, allowing you to configure templating, content filtering, and data masking for your applications. With its orchestration service, you can streamline workflows and manage AI models within SAP AI Core.

- **Templating**: Create dynamic prompts with placeholders to customize AI interactions based on user inputs.
- **Content Filtering**: Apply filters to ensure input and output adhere to content safety guidelines.
- **Data Masking**: Anonymize sensitive information with data masking features.

### AI Management with `@sap-ai-sdk/ai-api`
The [@sap-ai-sdk/ai-api](https://github.com/SAP/ai-sdk-js/tree/main/packages/ai-api#readme) package provides comprehensive tools for managing scenarios and workflows in SAP AI Core. You can automate processes such as creating artifacts, configurations, and deployments; executing batch inference jobs; and managing Docker registries and object storage for training data.

- **Artifact Management**: Register and manage datasets and other model artifacts.
- **Configuration Management**: Set up configurations for different models and use cases.
- **Deployment Management**: Deploy AI models and manage their lifecycle within SAP AI Core.


### LangChain Integration with `@sap-ai-sdk/langchain`
The [@sap-ai-sdk/langchain](https://github.com/SAP/ai-sdk-js/tree/main/packages/langchain#readme) package provides LangChain model clients built on top of the foundation model clients of the SAP Cloud SDK for AI, enabling the development of complex AI pipelines within your SAP BTP applications.

- **Client Initialization**: Easily initialize chat and embedding clients using model names and optional parameters for more precise configurations.
- **Chat Client**: Interact with Azure OpenAI models and invoke prompts directly.
- **Embedding Client**: Embed text and documents, allowing integration with other LangChain utilities for preprocessing and storage.


### Generative AI with `@sap-ai-sdk/foundation-models`
The [@sap-ai-sdk/foundation-models](https://github.com/SAP/ai-sdk-js/tree/main/packages/foundation-models#readme) package integrates generative AI foundation models into your AI activities. It provides access to pre-trained models deployed in SAP’s generative AI hub and allows for creating sophisticated language-based applications.

- **Azure OpenAI Client**: Interact with chat and embedding models, supporting operations like chat completion and embeddings.
- **Caching and Performance**: Automatically caches deployment information to optimize performance for frequent requests.

## Getting Started
To explore these packages further, check out our [sample project](https://github.com/SAP/ai-sdk-js/tree/main/sample-code) demonstrating the usage of various SDK packages.

## Your Feedback Matters
We value your feedback on this initial release! Share your thoughts or ideas in the [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).
