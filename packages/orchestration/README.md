# @sap-ai-sdk/orchestration

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Table of Contents

- [Installation](#installation)
- [Documentation](#documentation)
- [OpenTelemetry](#opentelemetry)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```bash
npm install @sap-ai-sdk/orchestration
```

## Documentation

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

## OpenTelemetry

`OrchestrationClient` emits OpenTelemetry spans following the [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) automatically — no code changes required.

```ts
// chatCompletion: span covers the full HTTP round-trip
const response = await client.chatCompletion({ messages: [...] });

// stream: span stays open until the last chunk is consumed
const streamResponse = await client.stream({ messages: [...] });
for await (const chunk of streamResponse.stream) { /* ... */ }
```

Spans include `gen_ai.system`, `gen_ai.operation.name`, `gen_ai.request.model`, token usage, and finish reason. See the [OpenTelemetry guide](../../docs/open-telemetry.md) for setup instructions, the full attribute reference, and examples for building a multi-turn agent trace hierarchy.

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
