# @sap-ai-sdk/core

## 2.6.0

## 2.5.0

## 2.4.0

### Minor Changes

- 2e1d2c2: [Improvement] Added `anthropic--claude-4.5-sonnet` , `anthropic--claude-4.5-haiku` , `gemini-2.5-flash-lite` and `sap-abap-1` to the available model list.
  Removed deprecated models `gemini-2.0-flash` and `gemini-2.0-flash-lite` scheduled for retirement.

## 2.3.0

## 2.2.0

### Minor Changes

- 6100bca: [Improvement] Add `cohere--command-a-reasoning`, `mistralai--mistral-medium-instruct` and perplexity-ai `sonar` and `sonar-pro` to model list
- 347eac1: [New Functionality] Introduce orchestration embedding client for consuming embedding feature of the orchestration service.

### Patch Changes

- 5225275: [Fixed Issue] Replace active logging during streaming with error throwing to avoid logging the response payload.

## 2.1.0

### Minor Changes

- 0cf7d80: [Improvement] Remove `alephalpha-pharia-1-7b-control` and `deepseek-ai--deepseek-r1` from available model list.

## 2.0.0

### Minor Changes

- 500c0dd: [Improvement] Add `gpt-5`,`gpt-5-mini` and `gpt-5-nano` to and remove `gemini-1.5-flash`, `gemini-1.5-pro` and `ibm--granite-13b-chat` from the available model list.

### Patch Changes

- 9e1c43a: [Improvement] Add `anthropic--claude-4-opus`, `anthropic--claude-4-sonnet`, `amazon--nova-premier`, `gemini-2.5-flash` and `gemini-2.5-pro` to and remove `mistralai--mixtral-8x7b-instruct-v01`, `meta--llama3.1-70b-instruct`, `nvidia--llama-3.2-nv-embedqa-1b`, `amazon--titan-embed-text`, `gpt-4`, `amazon--titan-text-express` and `amazon--titan-text-lite` from the available model list.

## 1.17.0

## 1.16.0

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
