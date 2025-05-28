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

