[//]: # "Please don't delete the following comments and keep them in the beginning of this document. Also, keep the first line empty."

[//]: # (Example known issue: Making OData requests using a proxy defined in the environment variables is not possible \(see improvements\).)
[//]: # (Example compatibility note: [core] Rename `entityConstructor`, `linkedEntity`, `fieldName` [properties]\(https://help.sap.com/doc/7f30fcdb8c424be9b1d4ecbfd7dd972f/1.0/en-US/classes/_sap_cloud_sdk_core.entity.html\) in generated entities to `_entityConstructor`, `_linkedEntity`, `_fieldName`.)
[//]: # (Example new functionality: [generator] Support the generation of clients for services using nested complex types.)
[//]: # (Example improvement: Allow setting the log levels of SDK loggers more conveniently through a single function [`setLogLevel\(\)`]\(https://help.sap.com/doc/7f30fcdb8c424be9b1d4ecbfd7dd972f/1.0/en-US/modules/_sap_cloud_sdk_util.html#setloglevel\).)
[//]: # (Example fixed issue: Fix the parameter type of `fromJson` method so that passing a json object with illegal attributes is not allowed. For example, `{ bupa : '1' }` cannot be passed to the method when building a `BusinessPartner`.)
[//]: # (Example function removed: [generator] Remove the option: `aggregatorDirectoryName`)
[//]: # (Example function moved: Move the following functions to `connectivity` package)

# Next

## Breaking Changes

### Function removed

- 

### Function moved

- 

### Signature changed

-

### Implementation changed

-

# 2.6.0
## New Features

- [rpt] Release Beta version of a client for the SAP-RPT-1 model. (790ad05)

## Fixed Issues

- [orchestration] Export `isConfigReference()` method as a value instead of type-only export.
  This function can now be imported and used at runtime to check if a configuration is an orchestration configuration reference type. (f3b6dc5)

# 2.5.0
## Compatibility Notes

- [langchain] The `@langchain/core` package is now a peer dependency.
  You now have to install the `@langchain/core` package as a direct dependency of your project. (5b88f6f)

## New Features

- [langchain] Support disabling streaming completely via the langchain option `disableStreaming`. (b91e0a7)
- [langchain] Support auto-streaming via the langchain option `streaming`. When enabled (e.g., transparently by LangGraph), responses are automatically streamed in `invoke()` calls. (b91e0a7)
- [orchestration] Add support for orchestration configuration references in the orchestration client. (2f19a40)

## Fixed Issues

- [langchain] Pin `@langchain/core` to v1.1.8 to avoid a regression. (9ff7cec)

## Improvements

- [langchain] Move the `@langchain/core` package from dependencies to peer dependencies.
  This reduces the chance of version incompatibilities between langchain-related packages. (5b88f6f)

# 2.4.0
## Compatibility Notes

- [prompt-registry] In the prompt-registry client schema, the `Template` type was renamed to `PromptTemplate`. (a3cbc6e)

## New Features

- [orchestration] Added support for `applyTo` and `translateMessagesHistory` in order to enable selective input translation and automatic inference of target language for output translation parameters. (aa097da)
- [prompt-registry] Update prompt-registry specification adding support for resource group scoped prompt templates. (a3cbc6e)

## Improvements

- [core] Added `anthropic--claude-4.5-sonnet` , `anthropic--claude-4.5-haiku` , `gemini-2.5-flash-lite` and `sap-abap-1` to the available model list.
  Removed deprecated models `gemini-2.0-flash` and `gemini-2.0-flash-lite` scheduled for retirement. (2e1d2c2)

# 2.3.0
## Compatibility Notes

- [langchain, orchestration, prompt-registry] `zod` was upgraded to v4 (7c9605d)

## New Features

- [langchain] Bump langchain to v1 (7c9605d)
- [orchestration] Added support for `protected_material_code` property to `buildAzureContentSafetyFilter()` function for output filter configuration to allow detecting protected code content from known github repositories. (485e21b)

# 2.2.0
## Compatibility Notes

- [document-grounding] `MSSharePointConfigurationGetResponse` now requires the `sharePoint` property (e2c34f3)
- [document-grounding] `CommonConfiguration` was replaced with backend-specific types: `SFTPConfiguration` and `S3Configuration` (e2c34f3)
- [document-grounding] Some types have been renamed to include endpoint-specific prefixes.
  Some instances of the prior names may still exist:
  - `SearchResults` was renamed to `VectorSearchResults` / `RetrievalSearchResults`
  - `Chunk` was renamed to `VectorChunk` / `RetrievalChunk`
  - `SearchFilter` was renamed to `VectorSearchFilter`
  - `KeyValueListPair` was renamed to `VectorKeyValueListPair` / `RetrievalKeyValueListPair`
  - `DocumentKeyValueListPair` was renamed to `VectorDocumentKeyValueListPair` / `RetrievalDocumentKeyValueListPair`
  - `SearchConfiguration` was renamed to `VectorSearchConfiguration` / `RetrievalSearchConfiguration`
  - `SearchSelectOptionEnum` was renamed to `VectorSearchSelectOptionEnum` / `RetrievalSearchSelectOptionEnum`
  - `PerFilterSearchResult` was renamed to `RetrievalPerFilterSearchResult`
  - `PerFilterSearchError` was renamed to `RetrievalPerFilterSearchError`
  - `DataRepositorySearchResult` was renamed to `RetrievalDataRepositorySearchResult`
  - `SearchInput` was renamed to `RetrievalSearchInput` (e2c34f3)
- [langchain] Remove structured ouput handling for deprecated gpt-4 & gpt-3 models (6100bca)

## New Features

- [ai-api] Update `ai-api` package with the new specification (2509b). (58464e9)
- [core, orchestration] Introduce orchestration embedding client for consuming embedding feature of the orchestration service. (347eac1)
- [document-grounding] Update document-grounding specification (e2c34f3)

## Fixed Issues

- [core] Replace active logging during streaming with error throwing to avoid logging the response payload. (5225275)

## Improvements

- [core, orchestration] Add `cohere--command-a-reasoning`, `mistralai--mistral-medium-instruct` and perplexity-ai `sonar` and `sonar-pro` to model list (6100bca)

# 2.1.0
## Fixed Issues

- [orchestration] Fix JSDoc example of `buildAzureContentSafetyFilter()` function. (0cf7d80)

## Improvements

- [core] Remove `alephalpha-pharia-1-7b-control` and `deepseek-ai--deepseek-r1` from available model list. (0cf7d80)

# 2.0.0
## Compatibility Notes

- [foundation-models, orchestration] Change stream method parameter from `AbortController` to `AbortSignal`.
  The `stream()` method now accepts an `AbortSignal` instead of an `AbortController` as the second parameter in both Azure OpenAI and Orchestration clients. (4c00c27)
- [foundation-models, orchestration] Response object `data` property is renamed to `_data`.
  Use getter methods like `getContent()`, `getTokenUsage()`, `getAssistantMessage()` instead of direct data access. (5c52cb6)
- [foundation-models] Move generated types to internal exports while keeping frequently used types in main exports.
  - Generated types are no longer exported from `@sap-ai-sdk/foundation-models` and must be imported from `@sap-ai-sdk/foundation-models/internal.js` instead.
  - Frequently used types (`AzureOpenAiChatCompletionTool`, `AzureOpenAiFunctionObject`, `AzureOpenAiChatCompletionRequestMessage`, `AzureOpenAiChatCompletionRequestSystemMessage`, `AzureOpenAiChatCompletionRequestUserMessage`, `AzureOpenAiChatCompletionRequestAssistantMessage`, `AzureOpenAiChatCompletionRequestToolMessage`) remain available from main package exports.
  - Add new type `AzureOpenAiChatCompletionParameters` to replace `AzureOpenAiCreateChatCompletionRequest` which is no longer exported publicly. (5c52cb6)
- [langchain] Major breaking changes for LangChain orchestration v2:
  - Update LangChain orchestration configuration structure to use `promptTemplating` instead of separate `llm` and `templating` properties.
  - Replace `llm.model_name` with `promptTemplating.model.name` and `llm.model_params` with `promptTemplating.model.params`.
  - The `templating.template` property is now `promptTemplating.prompt.template`.
  - Rename `inputParams` parameter to `placeholderValues` in LangChain orchestration client methods.
  - Update message response property names from `module_results` to `intermediate_results` in additional kwargs. (86e6370)
- [langchain] Update imports to use new API facade from foundation-models package.
  - Some generated types now need to be imported from `@sap-ai-sdk/foundation-models/internal.js` instead of `@sap-ai-sdk/foundation-models`.
  - Update to use new `AzureOpenAiChatCompletionParameters` type to replace `AzureOpenAiCreateChatCompletionRequest` which is no longer exported publicly. (5c52cb6)
- [orchestration] `buildTranslationConfig()` function now requires `type` parameter to distinguish between `input` and `output` translation configuration. (740ba78)
- [orchestration] `buildLlamaGuardFilter()` function has been renamed to `buildLlamaGuard38BFilter()`. It now requires a type parameter to distinguish between `input` and `output` filter configurations, and accepts filter categories as an array. (740ba78)
- [orchestration] Move generated types to internal exports while keeping frequently used types in main exports.
  - Generated types are no longer exported from `@sap-ai-sdk/orchestration` and must be imported from `@sap-ai-sdk/orchestration/internal.js` instead.
  - Frequently used types (`ChatMessage`, `SystemChatMessage`, `UserChatMessage`, `AssistantChatMessage`, `ToolChatMessage`, `DeveloperChatMessage`, `ChatCompletionTool`, `FunctionObject`) remain available from main package exports. (5c52cb6)
- [orchestration] `buildAzureContentSafetyFilter()` function now requires `type` parameter to distinguish between `input` and `output` filter configuration. (997e8ec)
- [orchestration] Major breaking changes for orchestration v2:
  - Consolidate `llm` and `templating` modules into a single `promptTemplating` module.
  - The `llm.model_name` property is now `promptTemplating.model.name` and `llm.model_params` is now `promptTemplating.model.params`.
  - The `templating.template` property is now `promptTemplating.prompt.template`.
  - Rename `inputParams` parameter to `placeholderValues` in orchestration client methods.
  - Update response property names from `orchestration_result` to `final_result` and `module_results` to `intermediate_results`.
  - Replace top-level `stream` property with `streamOptions.enabled` and update streaming module options from `llm` to `promptTemplating`.
  - Update grounding configuration to use `placeholders.input` and `placeholders.output` instead of separate `input_params` and `output_param`.
  - Update Azure content filter property names to lowercase with underscores: `Hate` to `hate`, `SelfHarm` to `self_harm`, `Sexual` to `sexual`, and `Violence` to `violence`.
  - Remove deprecated `buildAzureContentFilter()` function and use `buildAzureContentSafetyFilter()` instead. (86e6370)

## New Features

- [ai-api] Add `resolveDeploymentUrl()` function to resolve the deployment URL that matches the given criteria. (14745de)
- [foundation-models] Add `getTokenUsage()`, `getFinishReason()`, `getContent()`, `getToolCalls()`, `getRefusal()`, `getAssistantMessage()`, `findChoiceByIndex()` methods to Azure OpenAI chat completion response. (5c52cb6)
- [orchestration] Add `prompt_shield` property to `buildAzureContentSafetyFilter()` function for input filter configuration to allow enabling prompt attack detection. (997e8ec)
- [orchestration] Add `getIntermediateResults()` method to `OrchestrationResponse`, `OrchestrationStreamResponse`, `OrchestrationStreamChunkResponse` classes for accessing intermediate processing results from orchestration modules. (5c52cb6)
- [orchestration] Add `deploymentId` as the optional parameter for OrchestrationClient initialization. (0a418d0)
- [orchestration] Add `findChoiceByIndex()` method to find specific choices by index in streaming responses. (5c52cb6)

## Improvements

- [core] Add `gpt-5`,`gpt-5-mini` and `gpt-5-nano` to and remove `gemini-1.5-flash`, `gemini-1.5-pro` and `ibm--granite-13b-chat` from the available model list. (500c0dd)
- [core] Add `anthropic--claude-4-opus`, `anthropic--claude-4-sonnet`, `amazon--nova-premier`, `gemini-2.5-flash` and `gemini-2.5-pro` to and remove `mistralai--mixtral-8x7b-instruct-v01`, `meta--llama3.1-70b-instruct`, `nvidia--llama-3.2-nv-embedqa-1b`, `amazon--titan-embed-text`, `gpt-4`, `amazon--titan-text-express` and `amazon--titan-text-lite` from the available model list. (9e1c43a)

# 1.17.0
## New Features

- [langchain] Support `withStructuredOutput()` method in OpenAI LangChain client. (8bb24c3)

## Fixed Issues

- [langchain] Use `isInteropZodSchema` instead of `isZodSchemaV4` in LangChain Azure OpenAI and Orchestration clients to support both Zod v3 and v4 schemas. (8d54af6)

## Improvements

- [orchestration] Add support for standard and custom DPI entities in `buildDpiMaskingProvider()` function.
  Allow configuration of masking strategies via `replacement_strategy` for both entity types. (fab35bc)
- [orchestration] Add utility functions `getContent()`, `getRefusal()`, `getAllMessages()`, `getAssistantMessage()`, and `getResponse()` to stream response. (225f40c)

# 1.16.0
## Compatibility Notes

- [document-grounding] Refactor `Pipelines` to `GetPipelines`, `Pipeline` to `GetPipeline`, `PipelinePostRequest` to `CreatePipeline`, `PipelineStatus` to `GetPipelineStatus`, and `RetievalSearchResults` to `RetrievalSearchResults`. (efffc16)
- [langchain] Adjust content of chat result in LangChain Orchestration by removing `finish_reason`, `index`, `function_call`, `request_id` from `additional_kwargs` and adding `tool_calls` and `request_id` in `generationInfo`.` (e9c19b4)
- [orchestration] The type of `logprobs` in the response is corrected as a result of a bug fix from the Orchestration service. (9a0d6f7)
- [orchestration] The `ModuleResults` and `LlmModuleResult` types are now only meant to be used for the non-streaming case.
  Previously, they represented both streaming and non-streaming response.
  For streaming, use `ModuleResultsStreaming` and `LlmModuleResultStreaming` types instead.
  - @sap-ai-sdk/ai-api@1.16.0
  - @sap-ai-sdk/core@1.16.0
  - @sap-ai-sdk/prompt-registry@1.16.0 (9a0d6f7)

## New Features

- [document-grounding] Support the new pipeline trigger API and the enhanced pipeline status API. (efffc16)
- [foundation-models] Support Azure OpenAI streaming with tool calls. (e9c19b4)
- [langchain] Support LangChain OpenAI streaming. (e9c19b4)

## Fixed Issues

- [langchain] Retry on timeout for non-streaming requests in LangChain Orchestration client. (268c38e)
- [orchestration] The `role` property of the `ResponseChatMessage` type is now mandatory as it is always returned. (9a0d6f7)

# 1.15.0
## New Features

- [langchain] Support `bindTools()` method in Orchestration LangChain client. (4474313)

## Improvements

- [core] Add `o3`, `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`, `o4-mini` and `mistralai--mistral-small-instruct` to available model list. (5307dd0)

# 1.14.0
## Compatibility Notes

- [orchestration] Since `ChatMessage` type is now one of the many specific types such as `SystemChatMessage` and `UserChatMessage` with predefined roles in the orchestration service specification, always define type when creating objects of type `OrchestrationModuleConfig` and `TemplatingModuleConfig` to avoid `role` being any string. (fa1e3fe)

## New Features

- [document-grounding] Support document grounding with SharePoint and S3 data repositories.
  - @sap-ai-sdk/core@1.14.0 (fa1e3fe)
- [langchain, orchestration] Support streaming in LangChain orchestration client. (fa1e3fe)
- [langchain] Support `bindTools()` method in Azure OpenAI LangChain client. (fa1e3fe)
- [orchestration] Introduce convenience functions `getAllMessages()`, `getAssistantMessage()`, `getToolCalls()` and `getRefusal()` for orchestration. (fa1e3fe)
- [orchestration] Introduce support for tool calls, for both streaming and regular invocation. (fa1e3fe)
- [orchestration] Add support for orchestration translation module.
  Implement `buildTranslationConfig()` convenience function to build translation config. (c62253f)
- [orchestration] Support document grounding with SharePoint and S3 data repositories.
  - @sap-ai-sdk/ai-api@1.14.0
  - @sap-ai-sdk/core@1.14.0
  - @sap-ai-sdk/prompt-registry@1.14.0 (fa1e3fe)

## Improvements

- [orchestration] Make `templating` and `templating.template` properties optional in the `Prompt` type and introduce a new `messages` property to allow sending messages directly without requiring a template. This enables users to reuse the same client instance without re-initialization by passing updated messages at runtime. (fa1e3fe)

# 1.13.0
## Fixed Issues

- [foundation-models] Remove incorrect error logging if finish reason is null in the streaming chunk. (8130838)

## Improvements

- [core] Add `gemini-2.0-flash`, `gemini-2.0-flash-lite`, `anthropic--claude-3.7-sonnet` and `deepseek-ai--deepseek-r1` to and remove `gemini-1.0-pro` from the available model list. (a6ba3af)

# 1.12.0
## Compatibility Notes

- [langchain] Use `LangchainOrchestrationModuleConfig` to type the configuration object passed to the LangChain orchestration client. (5360c8c)

## New Features

- [orchestration] Add support for passing a YAML specification as a string to the `templating` property in `OrchestrationModuleConfig`. (5360c8c)

# 1.11.0
## Compatibility Notes

- [core] Removed deprecated models: - `text-embedding-ada-002`, use `text-embedding-3-small` or `text-embedding-3-large` instead. - `meta--llama3-70b-instruct`, use `meta--llama3.1-70b-instruct` instead. - `gpt-35-turbo`, use `gpt-4o-mini` instead. - `gpt-35-turbo-16k`, use `gpt-4o-mini` instead. - `gpt-4-32k`, use `gpt-4o` instead. (627a152)

## New Features

- [langchain] Support using data masking in LangChain orchestration client. (3f8bd81)
- [langchain] Support using content filtering in LangChain orchestration client. (e1f2b5a)
- [orchestration] Introduce `buildDpiMaskingProvider()` convenience function to build masking provider `SAP Data Privacy Integration`. (a8d05b0)
- [orchestration] Support setting `metadata_params` property in `buildDocumentGroundingConfig()` convenience function. (264c5b0)

# 1.10.0
## New Features

- [prompt-registry] Add a new package `@sap-ai-sdk/prompt-registry` for consuming APIs from prompt registry service. (01ffe58)

## Improvements

- [core] Add `o1`, `o3-mini` and `alephalpha-pharia-1-7b-control` to the available model list. (6f28f47)

# 1.9.0
## New Features

- [langchain] Add LangChain Orchestration client. (a45dc06)
- [orchestration] Introduce `buildLlamaGuardFilter()` convenience function to build Llama guard filters. (bc51f59)

## Fixed Issues

- [ai-api, core] Add missing cause in the error object for failing HTTP requests by using `ErrorWithCause`, providing more context for debugging.

  [Compatibility Note] Due to the introduction of `ErrorWithCause`, `AxiosError` is now wrapped inside the `cause` property.
  For example, use `error.cause.response.data` instead of `error.response.data` to access the error response from the server. (bfed500)

## Improvements

- [orchestration] Update Orchestration to 2502b Release (84175fb)

