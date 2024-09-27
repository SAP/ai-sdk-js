# Sample CAP Application with SAP Cloud SDK for AI

Sample CAP application written in TypeScript to demonstrate the usage of SAP Cloud SDK for AI. 

## Build and Run Locally

1. Build the application with `pnpm install`.

2. Bind the application to your AI Core instance:

  ```bash
  cds bind -2 AI_CORE_INSTANCE_NAME
  ```

3. Run the application: 

  ```bash
  cds bind -2 AI_CORE_INSTANCE_NAME --exec -- pnpm start
  ```

### Usage

#### Azure OpenAI Chat Completion

```bash
curl --request POST \
  --url 'http://localhost:4004/odata/v4/chat-completions/ChatCompletions' \
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
