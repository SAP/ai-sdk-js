---
'@sap-ai-sdk/orchestration': minor
---

[compat] Support for constructing an `OrchestrationStreamResponse` without an `HttpResponse` has been deprecated, and will be removed in the next major release.
Code directly instantiating this class should be updated to provide an `HttpResponse` object as the first parameter.
