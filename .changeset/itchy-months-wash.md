---
'@sap-ai-sdk/ai-api': patch
'@sap-ai-sdk/core': patch
---

[Fixed Issue] Add missing call stack and server response in the error by using `ErrorWithCause`.

[Compatibility Note] Due to the introduction of `ErrorWithCause`, `AxiosError` is now wrapped inside the `cause` property. 
For example, use `error.cause.response.data` instead of `error.response.data` to access the error response from the server.
