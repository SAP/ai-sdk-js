---
'@sap-ai-sdk/ai-api': patch
'@sap-ai-sdk/core': patch
---

[Improvement] Introduce `ErrorWithCause` for request error handling.

[Compatibility Note] Due to the introduction of `ErrorWithCause`, the error structured is slightly different now.
For example, use `error.cause.response.data` instead of `error.response.data` to access the error response from the server.
```
