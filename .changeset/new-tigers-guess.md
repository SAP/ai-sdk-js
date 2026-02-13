---
'@sap-ai-sdk/rpt': minor
---

[feat] Add generic HTTP request configuration support.
The `predictWithSchema()` and `predictWithoutSchema()` methods now accept an optional `customRequest` parameter of type `RptRequestOptions`, allowing configuration of custom HTTP request options such as headers, timeout, and middlewares.
