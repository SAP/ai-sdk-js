[![REUSE status](https://api.reuse.software/badge/github.com/SAP/ai-sdk-js)](https://api.reuse.software/info/github.com/SAP/ai-sdk-js)
[![Fosstars security rating](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_badge.svg)](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_report.md)

# SAP Cloud SDK for AI

Integrate chat completion into your business applications with SAP Cloud SDK for AI. Leverage the generative AI hub of SAP AI Core to make use of templating, grounding, data masking, content filtering and more. Setup your SAP AI Core instance with SAP Cloud SDK for AI Core.

## Disclaimer ⚠️

This project is currently in an experimental state. All functionality and naming is subject to change. Use at your own discretion.

## Table of Contents

- [Disclaimer ⚠️](#disclaimer-️)
- [Table of Contents](#table-of-contents)
- [Packages](#packages)
  - [@sap-ai-sdk/ai-api](#sap-ai-sdkai-api)
  - [@sap-ai-sdk/foundation-models](#sap-ai-sdkfoundation-models)
  - [@sap-ai-sdk/orchestration](#sap-ai-sdkorchestration)
- [SAP Cloud SDK for AI Sample Project](#sap-cloud-sdk-for-ai-sample-project)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [Security / Disclosure](#security--disclosure)
- [Code of Conduct](#code-of-conduct)
- [Licensing](#licensing)

## Packages

This project publishes multiple packages and is managed using [pnpm](https://pnpm.io/)

### @sap-ai-sdk/orchestration

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

#### Installation

```
$ npm install @sap-ai-sdk/orchestration
```

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

## SAP Cloud SDK for AI Sample Project

We have created a sample project demonstrating the different clients' usage of the SAP Cloud SDK for AI for TypeScript/JavaScript. The [project README](./sample-code/README.md) outlines the set-up needed to build and run it locally.

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Security / Disclosure

If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/SAP/ai-sdk-js/security/policy) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2024 SAP SE or an SAP affiliate company and ai-sdk-js contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/ai-sdk-js).
