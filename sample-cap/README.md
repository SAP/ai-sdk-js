# Sample CAP Application with SAP Cloud SDK for AI

Sample CAP application written in TypeScript to demonstrate the usage of SAP Cloud SDK for AI.

### Table of Contents

- [Local Deployment](#local-deployment)
- [Remote Deployment](#remote-deployment)
- [Usage](#usage)
  - [`ai-api`](#ai-api)
  - [`foundation-models`](#foundation-models)
  - [`orchestration`](#orchestration)

## Local Deployment

1. Install dependencies using `pnpm install`.

2. Login using `cf login -a API_ENDPOINT -o ORG -s SPACE`.

3. Bind the application to your AI Core instance:

   ```bash
   cds bind -2 AI_CORE_INSTANCE_NAME
   ```

4. Run the application with the binding:

   ```bash
   pnpm watch:hybrid
   ```

## Remote Deployment

> [!WARNING]  
> All CDS services are marked with `@requires: 'any'` and are publicly accessible in order to simplify the deployment process.
> Apply proper authentication mechanisms to avoid unauthorized access.

1. Update the `@sap-ai-sdk/*` dependencies from `"workspace:^"` to the semver version `^1`
2. Install dependencies using `pnpm install`.
3. Transpile the CAP application using `pnpm build`.
4. Run `deploy:postbuild` to add a `package-lock.json`
5. Modify `services` and `routes` values in `manifest.yml`.
6. Login using `cf login -a API_ENDPOINT -o ORG -s SPACE`.
7. Deploy the application using `cf push`.

## Usage

For local deployment, set `SAMPLE_CAP_HOST` as `http://localhost:4004`. For remote deployment, set `SAMPLE_CAP_HOST` as the `route` value defined in `manifest.yaml`.

### `ai-api`

#### Deployment API

```bash
curl --request POST \
  --url $SAMPLE_CAP_HOST/odata/v4/ai-api/getDeployments
```

### `foundation-models`

#### Azure OpenAI Chat Completion

```bash
curl --request POST \
  --url $SAMPLE_CAP_HOST/odata/v4/azure-openai/chatCompletion \
  --header 'Content-Type: application/json' \
  --data '{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}'
```

### `orchestration`

#### Chat Completions with Templating

```bash
curl --request POST \
  --url $SAMPLE_CAP_HOST/odata/v4/orchestration/chatCompletion \
  --header 'Content-Type: application/json' \
  --data '{
  "template": [
    {
      "role": "user",
      "content": "What is the capital of {{?country}}"
    }
  ],
  "inputParams": [
    {
      "name": "country",
      "value": "France"
    }
  ]
}'
```
