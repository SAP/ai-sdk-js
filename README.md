[![REUSE status](https://api.reuse.software/badge/github.com/SAP/ai-sdk-js)](https://api.reuse.software/info/github.com/SAP/ai-sdk-js)

# ai-sdk-js

## Disclaimer

This project is currently in an experimental state. All functionality and naming is subject to change. Use at your own discretion.

## About this project

Integrate chat completion into your business applications with SAP Cloud SDK for GenAI Hub. Leverage the Generative AI Hub of SAP AI Core to make use of templating, grounding, data masking, content filtering and more. Setup your SAP AI Core instance with SAP Cloud SDK for AI Core.

## Requirements and Setup

_Insert a short description what is required to get your project running..._

## Documentation

## List of Available APIs
We maintain a list of [currently available and tested AI Core APIs](./docs/list-tested-APIs.md)

## Packages

### @sap-ai-sdk/ai-core
This package provides tools to manage your scenarios and workflows in SAP AI Core.

- Streamline data preprocessing and model training pipelines
- Execute batch inference jobs
- Deploy inference endpoints for your trained models
- Register custom Docker registries, sync AI content from your own git repositories, and register your own object storage for training data and model artifacts

To install the SAP AI Core in your project, run:
```
$ npm install @sap-ai-sdk/ai-core
```
[See some example usage for the available APIs.](./packages/ai-core/README.md)

### @sap-ai-sdk/gen-ai-hub
This package incorporates generative AI into your AI activities in SAP AI Core and SAP AI Launchpad.

To install the SAP Gen AI Hub in your project, run:
```
$ npm install @sap-ai-sdk/gen-ai-hub
```

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Security / Disclosure

If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/SAP/ai-sdk-js/security/policy) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2024 SAP SE or an SAP affiliate company and ai-sdk-js contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/ai-sdk-js).
