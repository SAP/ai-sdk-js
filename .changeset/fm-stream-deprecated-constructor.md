---
'@sap-ai-sdk/foundation-models': minor
---

[compat] Support for constructing an `AzureOpenAiChatCompletionStreamResponse` without an `HttpResponse` has been deprecated, and will be removed in the next major release.
Code directly instantiating this class should be updated to provide an `HttpResponse` object as the first parameter to allow reading from raw HTTP response.
