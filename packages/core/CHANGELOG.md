# @sap-ai-sdk/core

## 1.15.0

### Minor Changes

- 5307dd0: [Improvement] Add `o3`, `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`, `o4-mini` and `mistralai--mistral-small-instruct` to available model list.

## 1.14.0

## 1.13.0

### Minor Changes

- a6ba3af: [Improvement] Add `gemini-2.0-flash`, `gemini-2.0-flash-lite`, `anthropic--claude-3.7-sonnet` and `deepseek-ai--deepseek-r1` to and remove `gemini-1.0-pro` from the available model list.

## 1.12.0

## 1.11.0

### Minor Changes

- 627a152: [Compatibility Note] Removed deprecated models: - `text-embedding-ada-002`, use `text-embedding-3-small` or `text-embedding-3-large` instead. - `meta--llama3-70b-instruct`, use `meta--llama3.1-70b-instruct` instead. - `gpt-35-turbo`, use `gpt-4o-mini` instead. - `gpt-35-turbo-16k`, use `gpt-4o-mini` instead. - `gpt-4-32k`, use `gpt-4o` instead.

## 1.10.0

### Minor Changes

- 6f28f47: [Improvement] Add `o1`, `o3-mini` and `alephalpha-pharia-1-7b-control` to the available model list.

## 1.9.0

### Patch Changes

- bfed500: [Fixed Issue] Add missing cause in the error object for failing HTTP requests by using `ErrorWithCause`, providing more context for debugging.

  [Compatibility Note] Due to the introduction of `ErrorWithCause`, `AxiosError` is now wrapped inside the `cause` property.
  For example, use `error.cause.response.data` instead of `error.response.data` to access the error response from the server.

## 1.8.0

## 1.7.0

## 1.6.0

## 1.5.0

### Minor Changes

- b4a5506: [New Functionality] Add support for providing custom destination for AI Core besides using environment variable and service binding.

## 1.4.0

## 1.3.0

## 1.2.0

## 1.1.0

### Minor Changes

- 771f986: [Fixed Issue] Fix sending the correct resource group headers when custom resource group is set.

### Patch Changes

- 506a1e4: [Fixed Issue] Fix missing and unused dependencies.

## 1.0.0

## 0.1.0
