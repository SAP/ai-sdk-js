[![REUSE status](https://api.reuse.software/badge/github.com/SAP/ai-sdk-js)](https://api.reuse.software/info/github.com/SAP/ai-sdk-js)
[![Fosstars security rating](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_badge.svg)](https://github.com/SAP/ai-sdk-js/blob/fosstars/fosstars_report.md)

# ai-sdk-js

## Disclaimer

This project is currently in an experimental state. All functionality and naming is subject to change. Use at your own discretion.

## About this project

Integrate chat completion into your business applications with SAP Cloud SDK for GenAI Hub. Leverage the Generative AI Hub of SAP AI Core to make use of templating, grounding, data masking, content filtering and more. Setup your SAP AI Core instance with SAP Cloud SDK for AI Core.

## Requirements and Setup

_Insert a short description what is required to get your project running..._

### Running E2E tests locally

Before running the E2E tests, ensure that you have a `.env` file located in `tests/e2e-tests` folder.

Inside the `.env` file, define an `AICORE_SERVICE_KEY` variable and initialize it with the service binding of `aicore`. You can obtain this binding from the `VCAP_SERVICES` environment variable or from the service key defined in your BTP subaccount.

To run the tests, use the following command:

```
pnpm test:e2e
```

If you're using the Jest Runner extension in Visual Studio Code, you'll also need to add the following settings to your `settings.json` file before running the tests from VSCode:

```
 "jestrunner.debugOptions": {
    "runtimeArgs": ["--experimental-vm-modules"]
  },
  "jestrunner.jestCommand": "NODE_OPTIONS=--experimental-vm-modules node 'node_modules/jest/bin/jest.js'",
```

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Security / Disclosure

If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/SAP/ai-sdk-js/security/policy) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2024 SAP SE or an SAP affiliate company and ai-sdk-js contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/ai-sdk-js).
