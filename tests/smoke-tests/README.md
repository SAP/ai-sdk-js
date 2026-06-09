# Smoke Tests

The purpose of the smoke tests is to find obvious issues in the e2e process of using the SAP Cloud SDK for AI libs.

The sample application is running on Cloud Foundry and uses the current canary version of the SAP Cloud SDK for AI.

## Deployment approach

The smoke test app is deployed via `scripts/create-deployment.ts` rather than a plain `cf push` of the monorepo workspace. This is intentional:

- CF eagerly rebuilds binary dependencies during staging by running `npm install` (including package scripts). The trampoline package placed at the CF push root has empty `dependencies`/`devDependencies`, so CF has nothing to install and no build scripts are executed.
- CF's npm integration queries the registry unconditionally (requiring a token) even when `node_modules` and lockfiles are uploaded. The empty trampoline `package.json` sidesteps this.
- pnpm resolves dependencies with our custom strategy, and `pnpm deploy` is needed materialize workspace packages into the self-contained deployment package. Without a trampoline, CF would need to be provided a valid npm lockfile to avoid re-resolution of dependencies (e.g. via `npm shrinkwrap`).
- CF's nodejs buildpack uses npm and can be confused by pnpm's `node_modules` layout.

The trampoline package at the CF push root forwards all scripts to the inner `deploy/` directory via `cd deploy && npm run <script>`, so any scripts used by CF (`npm run start`, etc.) still work correctly.
These changes may be reverted once CF supports pnpm natively.

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

Download a service key for your AI Core service instance from SAP BTP.
Create a `.env` file in the `tests/smoke-tests` directory and add the service key under `AICORE_SERVICE_KEY`.
Run:

```bash
pnpm smoke-tests local
```

## Running the tests locally

With the `.env` file in place, run:

```bash
pnpm test:smoke
```

The test runner automatically starts and stops the local server.
Tests requiring CF destination service bindings are skipped automatically when running locally.
