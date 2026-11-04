# @sap-ai-sdk/core

**This package is designed for internal usage and should not be consumed directly.**

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package contains core utility functions that we reuse in the SDK to set the context and execute HTTP requests.
It also exports OpenTelemetry tracing helpers (`withAgentSpan`, `withToolSpan`, `withGenAiSpan`, `startGenAiSpan`) for teams that want to instrument their own agentic loops and tool executions with [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/).

### Installation

```bash
npm install @sap-ai-sdk/core
```

## Documentation

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

For OpenTelemetry integration details, see the [OpenTelemetry guide](../../docs/open-telemetry.md).

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
