---
'@sap-ai-sdk/ai-api': patch
'@sap-ai-sdk/core': patch
---

[Fixed Issue] Add missing cause in the error object for failing HTTP requests by using `ErrorWithCause`, providing more context for debugging.

[Compatibility Note] Due to the introduction of `ErrorWithCause`, `AxiosError` is now wrapped inside the `cause` property. 
For example, use `error.cause.response.data` instead of `error.response.data` to access the error response from the server.
