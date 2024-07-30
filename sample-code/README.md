# SAP AI SDK for JS E2E Test

![e2e-test](https://github.com/SAP/ai-sdk-js/actions/workflows/e2e-test.yml/badge.svg)

E2E test app for the JS variant of the AI SDK.

## Run the E2E Test

Trigger the [GitHub Action](https://github.com/SAP/ai-sdk-js/actions/workflows/e2e-test.yml).

To only run tests, without re-deploying the app, trigger the [test workflow](https://github.com/SAP/ai-sdk-js/actions/workflows/test.yml).

## Build, Run, Deploy Locally

Build the project with:

1. `npm install`
2. Download a service key for your AI Core service instance
3. Create a `.env` file in the sample-code directory
4. Add an entry `aicore='<content-of-service-key>'`
5. `npm run local`

Call the test endpoints:

* [Hello World](localhost:8080/)
* [Simple Chat Completion](localhost:8080/llm)
* [Simple Embedding Call](localhost:8080/embedding)

Deploy with:

1. `cf login` into your Cloud Foundry account
2. `cf push`
