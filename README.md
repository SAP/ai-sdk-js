[![REUSE status](https://api.reuse.software/badge/github.com/SAP/ai-sdk-js)](https://api.reuse.software/info/github.com/SAP/ai-sdk-js)
[![Fosstars security rating](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_badge.svg)](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_report.md)

# SAP Cloud SDK for AI

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

Integrate chat completion into your business applications with SAP Cloud SDK for AI. 
Leverage the generative AI hub of [SAP AI Core](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/what-is-sap-ai-core) to make use of templating, grounding, data masking, content filtering and more. 
Set up your SAP AI Core instance with SAP Cloud SDK for AI.

### Table of Contents

- [Documentation](#documentation)
- [Packages](#packages)
  - [@sap-ai-sdk/ai-api](#sap-ai-sdkai-api)
  - [@sap-ai-sdk/foundation-models](#sap-ai-sdkfoundation-models)
  - [@sap-ai-sdk/langchain](#sap-ai-sdklangchain)
  - [@sap-ai-sdk/orchestration](#sap-ai-sdkorchestration)
  - [@sap-ai-sdk/document-grounding](#sap-ai-sdkdocument-grounding)
  - [@sap-ai-sdk/prompt-registry](#sap-ai-sdkprompt-registry)
- [SAP Cloud SDK for AI Sample Project](#sap-cloud-sdk-for-ai-sample-project)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [Security / Disclosure](#security--disclosure)
- [Code of Conduct](#code-of-conduct)
- [Licensing](#licensing)

## Documentation

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

## Packages

This project publishes multiple packages and is managed using [pnpm](https://pnpm.io/)

### @sap-ai-sdk/ai-api

This package provides tools to manage your scenarios and workflows in SAP AI Core.

- Streamline data preprocessing and model training pipelines.
- Execute batch inference jobs.
- Deploy inference endpoints for your trained models.
- Register custom Docker registries, sync AI content from your own git repositories, and register your own object storage for training data and model artifacts.

#### Installation

```
$ npm install @sap-ai-sdk/ai-api
```

### @sap-ai-sdk/foundation-models

This package incorporates generative AI foundation models into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/foundation-models
```

### @sap-ai-sdk/langchain

This package provides LangChain model clients, built on top of the foundation model clients of the SAP Cloud SDK for AI.

#### Installation

```
$ npm install @sap-ai-sdk/langchain
```

### @sap-ai-sdk/orchestration

This package incorporates generative AI [orchestration](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration) capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/orchestration
```

### @sap-ai-sdk/document-grounding

> [!warning]
> This package is still in **beta** and is subject to breaking changes. Use it with caution.

This package incorporates generative AI document grounding [Pipeline API](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/pipeline-api-a9badce6a4da4df68e98549d64aa2217), [Vector API](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/vector-api-0358c5ca839d4cf7b4982dbcbc1ba7ff) and [Retrieval API](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/retrieval-api) into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/document-grounding
```

### @sap-ai-sdk/prompt-registry

This package incorporates generative AI [prompt registry](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/prompt-registry) into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/prompt-registry
```

## SAP Cloud SDK for AI Sample Project

We have created a sample project demonstrating the different clients' usage of the SAP Cloud SDK for AI for TypeScript/JavaScript.
The [project README](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/README.md) outlines the set-up needed to build and run it locally.

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## Security / Disclosure

If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/SAP/ai-sdk-js/security/policy) on how to report it.
Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone.
By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2024 SAP SE or an SAP affiliate company and ai-sdk-js contributors.
Please see our [LICENSE](LICENSE) for copyright and license information.
Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/ai-sdk-js).
