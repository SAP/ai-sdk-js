// Authoritative SAP AI SDK API surface.
// Overrides anything Context7 or docs might return incorrectly.
// Keep in sync with: packages/orchestration/src/ and packages/langchain/src/
export const SDK_KNOWLEDGE = `
## SAP AI SDK for JavaScript — Authoritative API Reference

### @sap-ai-sdk/orchestration — OrchestrationClient
- new OrchestrationClient(config, deploymentConfig?, destination?)
- chatCompletion(request?) → Promise<OrchestrationResponse>
- stream(request?, signal?, streamOptions?) → Promise<OrchestrationStreamResponse>
- NOT: streamChat(), complete(), chat()

### @sap-ai-sdk/orchestration — OrchestrationEmbeddingClient
- new OrchestrationEmbeddingClient(config, deploymentConfig?, destination?)
- embed(request: { input: string | string[] }) → Promise<OrchestrationEmbeddingResponse>
- response.getEmbeddings() → EmbeddingData[]

### @sap-ai-sdk/orchestration — OrchestrationResponse
- getContent(choiceIndex?) → string | undefined
- getFinishReason(choiceIndex?) → string | undefined
- getTokenUsage() → TokenUsage
- getAllMessages(choiceIndex?) → ChatMessages
- getToolCalls(choiceIndex?) → MessageToolCalls | undefined
- getRequestId() → string | undefined

### @sap-ai-sdk/orchestration — OrchestrationStreamResponse
- stream → AsyncIterable<OrchestrationStreamChunkResponse>
- getRequestId() → string | undefined

### @sap-ai-sdk/orchestration — OrchestrationStreamChunkResponse
- getDeltaContent(choiceIndex?) → string | undefined  (delta text of a single streaming chunk)

### @sap-ai-sdk/langchain — OrchestrationClient (LangChain wrapper)
- Extends BaseChatModel — use invoke(), stream(), bindTools(), withStructuredOutput()
- Constructor: new OrchestrationClient(config, langchainOptions?, deploymentConfig?, destination?)
- langchainOptions: { maxRetries?: number, disableStreaming?: boolean }
- NOT: streamChat(), chatCompletion() — use invoke() or stream() for LangChain

### @sap-ai-sdk/foundation-models — AzureOpenAiChatClient
- run(request) → Promise<AzureOpenAiChatCompletionResponse>
- stream(request) → Promise<AzureOpenAiChatCompletionStreamResponse>
- NOT: streamChat(), invoke()

### Authentication
- Set AICORE_SERVICE_KEY env var to the full JSON service key string
- SDK reads it automatically — no explicit auth code needed
- For .env files: use tsx --env-file=.env or node --env-file=.env

### Prompt template syntax
- Placeholder: { {?variableName}} (curly braces with question mark)
- Pass values via chatCompletion({ placeholderValues: { variableName: 'value' } })

### SAP AI Core model names
- Format for non-Azure models: '<provider>--<model-name>' e.g. 'anthropic--claude-4.5-haiku', 'anthropic--claude-4.5-sonnet'
- Format for Azure OpenAI models: direct deployment name e.g. 'gpt-4o', 'gpt-4-32k', 'gpt-5', 'gpt-5.2'
- NEVER use 'claude-3-opus', 'Claude 3.5 Sonnet' — these are not valid SAP AI Core model names (wrong format)
- In code examples, use '<your-model-name>' as placeholder when the specific model is unknown
- Reasoning models (gpt-5*, gpt-5.2*, o1*, o3*) via @sap-ai-sdk/langchain: max_tokens is
  automatically renamed to max_completion_tokens — this is a CONVERSION, not a failure.
  temperature is passed through unchanged. Direct AzureOpenAiChatClient (non-LangChain) users
  must use max_completion_tokens manually.
`.trim();
