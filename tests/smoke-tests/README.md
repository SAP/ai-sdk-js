# Smoke Tests

The purpose of the smoke tests is to find obvious issues in the e2e process of using the SAP Cloud SDK for AI libs.

The sample application is running on Cloud Foundry and uses the current canary version of the SAP Cloud SDK for AI.

## Deploying a new version of the sample code app

The sample application is deployed to SAP BTP every night.
To deploy a new version of the sample application manually, make sure to provide your own `.env` file in the `test/smoke-tests` subdirectory with the following environment variables:

- CF_API_URL
- CF_USER
- CF_PASSWORD
- CF_ORG
- CF_SPACE

Then, run:

```bash
pnpm smoke-tests create-deployment
pnpm smoke-tests cf-login
pnpm smoke-tests exec cf push
```

This copies the `dist` directory of the sample code app, logs in to SAP BTP and pushes the application using the CF CLI.

## Running the tests

To run the tests, run:

```bash
pnpm test:smoke
```

## Running the app locally

This is currently not possible.
We will fix this soon.

<!-- Download a service key for your AI Core service instance from SAP BTP.
Create a `.env.local` file in the sample-code directory and add the service key under`AICORE_SERVICE_KEY`.
Run:

```bash
pnpm smoke-tests create-deployment
pnpm smoke-tests local
``` -->
