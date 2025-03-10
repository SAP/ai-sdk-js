[![REUSE status](https://api.reuse.software/badge/github.com/SAP/ai-sdk-js)](https://api.reuse.software/info/github.com/SAP/ai-sdk-js)
[![Fosstars security rating](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_badge.svg)](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_report.md)

# SAP Cloud SDK for AI

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

Integrate chat completion into your business applications with SAP Cloud SDK for AI. 
Leverage the generative AI hub of [SAP AI Core](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/what-is-sap-ai-core) to make use of templating, grounding, data masking, content filtering and more. 
Setup your SAP AI Core instance with SAP Cloud SDK for AI.

### Table of Contents

- [Requirements and Setup](#requirements-and-setup)
- [Packages](#packages)
  - [@sap-ai-sdk/ai-api](#sap-ai-sdkai-api)
  - [@sap-ai-sdk/foundation-models](#sap-ai-sdkfoundation-models)
  - [@sap-ai-sdk/langchain](#sap-ai-sdklangchain)
  - [@sap-ai-sdk/orchestration](#sap-ai-sdkorchestration)
  - [@sap-ai-sdk/prompt-registry](#sap-ai-sdkprompt-registry)
- [SAP Cloud SDK for AI Sample Project](#sap-cloud-sdk-for-ai-sample-project)
- [Error Handling](#error-handling)
  - [Accessing Error Information](#accessing-error-information)
- [Local Testing](#local-testing)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [Security / Disclosure](#security--disclosure)
- [Code of Conduct](#code-of-conduct)
- [Licensing](#licensing)

## Requirements and Setup

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Ensure the project is configured with **Node.js v20 or higher**, along with **native ESM** support.

For further details, refer to the individual sections under [Packages](#packages).

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

For details on the client, refer to this [document](https://github.com/SAP/ai-sdk-js/blob/main/packages/ai-api/README.md).

### @sap-ai-sdk/foundation-models

This package incorporates generative AI foundation models into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/foundation-models
```

For details on foundation model clients, refer to this [document](https://github.com/SAP/ai-sdk-js/blob/main/packages/foundation-models/README.md).

### @sap-ai-sdk/langchain

This package provides LangChain model clients, built on top of the foundation model clients of the SAP Cloud SDK for AI.

#### Installation

```
$ npm install @sap-ai-sdk/langchain
```

For details on LangChain model client, refer to this [document](https://github.com/SAP/ai-sdk-js/blob/main/packages/langchain/README.md).

### @sap-ai-sdk/orchestration

This package incorporates generative AI [orchestration](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/orchestration) capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/orchestration
```

For details on orchestration client, refer to this [document](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md).

### @sap-ai-sdk/prompt-registry

This package incorporates generative AI [prompt registry](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/prompt-registry) into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/prompt-registry
```

For details on prompt registry client, refer to this [document](https://github.com/SAP/ai-sdk-js/blob/main/packages/prompt-registry/README.md).

## SAP Cloud SDK for AI Sample Project

We have created a sample project demonstrating the different clients' usage of the SAP Cloud SDK for AI for TypeScript/JavaScript.
The [project README](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/README.md) outlines the set-up needed to build and run it locally.

## Error Handling

A common error scenario is `Request failed with status code STATUS_CODE` coming from `AxiosError`. 
In this case, SAP Cloud SDK for AI uses [`ErrorWithCause`](https://sap.github.io/cloud-sdk/docs/js/features/error-handling) to provide more detailed error information.

### Accessing Error Information

For example, for the following nested `ErrorWithCause`

```ts
const rootCause = new Error('The root cause is a bug!');
const lowerLevelErrorWithCause = new ErrorWithCause('Failed to call function foo().', rootCause);
const upperLevelErrorWithCause = new ErrorWithCause('Process crashed.', lowerLevelErrorWithCause);
throw upperLevelErrorWithCause;
```

The error stack will look like this:

```txt
ErrorWithCause: Process crashed.
    at ...
Caused by:
ErrorWithCause: Failed to call function foo().
    at ...
Caused by:
Error: The root cause is a bug!
    at ...
```

- `error.stack` will contain the above stack trace.
- `error.message` will be `Process crashed.`.
- `error.cause.message` will be `Failed to call function foo().`.
- `error.rootCause.message` will be `The root cause is a bug!`.

In case of `AxiosError`, the response data will be part of the error stack and can be accessed via `error.cause.response.data`.

## Local Testing

To test SAP Cloud SDK for AI features locally during application development, follow these steps:

1. Download a service key for the AI Core service instance.
2. Set the downloaded service key as the `AICORE_SERVICE_KEY` environment variable in the local environment.

The SDK parses the service key from the environment variable to interact with the AI Core service.
This setup enables local testing of clients such as orchestration and OpenAI, provided that deployments for orchestration and OpenAI exist in SAP BTP.

> [!Tip]
> Ways to load environment variables might vary based on the framework you are using.
>
> For example, while the SAP Cloud SDK for AI uses the [dotenv](https://www.npmjs.com/package/dotenv) library to load environment variables, NextJS uses a [specific configuration](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables) to load them.

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
