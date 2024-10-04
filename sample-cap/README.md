# Sample CAP Application with SAP Cloud SDK for AI

Sample CAP application written in TypeScript to demonstrate the usage of SAP Cloud SDK for AI.

### Table of Contents

- [Local Deployment](#local-deployment)
- [Usage](#usage)
  - [`ai-api`](#ai-api)
    - [Deployment API](#deployment-api)
  - [`foundation-models`](#foundation-models)
    - [Azure OpenAI Chat Completion](#azure-openai-chat-completion)
  - [`orchestration`](#orchestration)
    - [Chat Completions with Templating](#chat-completions-with-templating)

## Local Deployment

1. Build the application with `pnpm install`.

2. Login using `cf login -a API_ENDPOINT -o ORG -s SPACE`.

3. Bind the application to your AI Core instance:

   ```bash
   cds bind -2 AI_CORE_INSTANCE_NAME
   ```

4. Run the application with the binding:

   ```bash
   cds bind -2 AI_CORE_INSTANCE_NAME --exec -- pnpm start
   ```

## Usage

### `ai-api`

#### Deployment API

```bash
curl --request GET \
  --url 'http://localhost:4004/odata/v4/ai-api/getDeployments'
```

### `foundation-models`

#### Azure OpenAI Chat Completion

```bash
curl --request POST \
  --url 'http://localhost:4004/odata/v4/azure-openai/chatCompletions' \
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
  --url 'http://localhost:4004/odata/v4/orchestration/chatCompletions' \
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
