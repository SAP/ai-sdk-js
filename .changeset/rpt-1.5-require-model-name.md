---
'@sap-ai-sdk/rpt': minor
---

[compat] Require model name in `RptClient` constructor.
Remove the default model name.
Pass one of the four known model names explicitly:

```ts
// before
new RptClient();

// after
new RptClient('sap-rpt-1.5');
```
