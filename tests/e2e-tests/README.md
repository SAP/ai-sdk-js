# E2E Test

![e2e-test](https://github.com/SAP/ai-sdk-js/actions/workflows/e2e-tests.yaml/badge.svg)

End-to-end tests for the SAP Cloud SDK for AI.

### Table of Contents

- [Local Testing](#local-testing)
- [Remote Testing](#remote-testing)

## Local Testing

1. Run `pnpm install` to install dependencies.
2. Create a `.env` file in the `sample-code` directory with your AI core service key by adding the following line:
   
   ```bash
   AICORE_SERVICE_KEY='SERVICE_KEY_JSON'
   ```

3. Run `pnpm test` to execute the tests.

## Remote Testing

Trigger the [GitHub Action](https://github.com/SAP/ai-sdk-js/actions/workflows/e2e-test.yml).
