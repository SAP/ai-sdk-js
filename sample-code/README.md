# Sample Code and E2E Test

![e2e-test](https://github.com/SAP/ai-sdk-js/actions/workflows/e2e-test.yaml/badge.svg)

Sample code to demonstrate the usage of the SAP AI SDK.
Also used as basis for running E2E tests.

## Build, Run, Deploy Locally

Build the project with:

1. `pnpm install`
2. Download a service key for your AI Core service instance
3. Create a `.env` file in the sample-code directory
4. Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`
5. `pnpm run local`

Call the test endpoints:

- [Hello World](localhost:8080/)
- [Simple Chat Completion](localhost:8080/llm)
- [Simple Embedding Call](localhost:8080/embedding)

## Run the E2E Test

Trigger the [GitHub Action](https://github.com/SAP/ai-sdk-js/actions/workflows/e2e-test.yml).
