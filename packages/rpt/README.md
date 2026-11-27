# @sap-ai-sdk/rpt

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides a client for SAP’s Relational Pretrained Transformer model, [SAP-RPT-1](https://www.sap.com/products/artificial-intelligence/sap-rpt.html).
It also provides an RPT Decisions client under `@sap-ai-sdk/rpt/decisions` to answer choice, binary (`noul`) and score questions based on labeled examples.

### Table of Contents

- [Installation](#installation)
- [Documentation](#documentation)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/rpt
```

## Documentation

Import `RptDecisionsClient` from `@sap-ai-sdk/rpt/decisions` and call `systemone()` with a state, questions and at least two labeled examples.
Pass a model name such as `sap-rpt-decisions`, or a deployment configuration with `deploymentId` and optional `resourceGroup`, to the constructor.
See the [programming language classification sample](../../sample-code/src/rpt-decisions.ts) for a complete example.

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
