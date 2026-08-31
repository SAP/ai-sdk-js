---
'@sap-ai-sdk/rpt': major
---

[compat] **Require model name in `RptClient` constructor.**
Remove the default model name.
Pass one of the four known model names explicitly:

```ts
// before
new RptClient();

// after
new RptClient('sap-rpt-1.5');
```

[compat] **Change `parse_data_types` default.** The server default changed from `true` to `false`.
Pass `parse_data_types: true` explicitly if you relied on the old default.

[compat] **Deprecate `sap-rpt-1-small` and `sap-rpt-1-large`.**
These model names remain functional until their retirement date (no earlier than 2026-12-31).

[compat] **Widen `TargetColumnConfig.prediction_placeholder` to accept `null`.**
The type is now `string | number | null` (was `string | number`).
