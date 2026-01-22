---
'@sap-ai-sdk/orchestration': major
---
[compat] Change `OrchestrationStreamResponse` constructor to require raw HTTP response.
The constructor now requires an `HttpResponse` parameter to initialize the response object.
Code directly instantiating this class must be updated to pass the raw response.
