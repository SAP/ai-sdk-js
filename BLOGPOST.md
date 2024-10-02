# Introducing the SAP Cloud SDK for AI (JavaScript/TypeScript) 🎉

The SAP Cloud SDK for AI is now available! This new SDK brings generative AI capabilities and simplifies integrating AI models into your SAP Business Technology Platform (BTP) applications.

Discover how this SDK helps you connect with the SAP AI Core and SAP Generative AI Hub, providing features like templating, grounding, data masking, and more. This blog post highlights key features, changes, and how you can get started with the SDK.

## What's New?

### AI Orchestration

With the `@sap-ai-sdk/orchestration` package, you can seamlessly integrate AI services from SAP AI Core into your applications. Orchestrate your AI workflows, execute batch jobs, and manage AI models—all through easy-to-use APIs.

To find out more about setting up orchestration, see the [documentation](https://github.com/SAP/ai-sdk-js#readme).

### LangChain Integration

Building upon the foundation model clients, the `@sap-ai-sdk/langchain` package brings powerful tools for chaining multiple language models together. Whether it’s for conversational AI, summarization, or document understanding, you can leverage the LangChain integration to build sophisticated pipelines.

Explore more about how you can use LangChain in the [LangChain package](https://github.com/SAP/ai-sdk-js#readme).

## What's Changed?

### Streamlined API Design

The new SDK features a streamlined API design, making it easier to manage AI services in your applications. We focused on unifying various services under a common structure, ensuring consistent behavior and improved usability.

### Node.js 18 Required

This release requires Node.js 18 or later to stay aligned with the latest updates on the SAP BTP. Make sure to update your environment if you're running an older Node.js version.

## Getting Started

To start using the SDK, install the relevant packages with:

```bash
npm install @sap-ai-sdk/orchestration
npm install @sap-ai-sdk/langchain
