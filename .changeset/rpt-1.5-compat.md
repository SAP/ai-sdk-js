---
'@sap-ai-sdk/rpt': major
---

compat: breaking changes when upgrading to RPT-1.5

**Require model name in `RptClient` constructor.**
Remove the default model name.
Pass one of the four known model names explicitly:

```ts
// before
new RptClient();

// after
new RptClient('sap-rpt-1.5');
```

**Change `parse_data_types` default for RPT-1.5 deployments.** The RPT-1.5 server default for `parse_data_types` is `false` (was `true` in 1.0).
Callers on `sap-rpt-1.5` or `sap-rpt-1.5-large` that relied on the old default must now pass `parse_data_types: true` explicitly.
Callers on `sap-rpt-1-small` or `sap-rpt-1-large` are unaffected — the SDK injects `parse_data_types: true` automatically for those model names.
If the client is constructed with a `deploymentId` instead of a model name, generation detection is not possible and the injection is skipped — pass `parse_data_types: true` explicitly in that case.

**Deprecate `sap-rpt-1-small` and `sap-rpt-1-large`.**
These model names remain functional until their retirement date (no earlier than 2026-12-31).

**Widen `TargetColumnConfig.prediction_placeholder` to accept `null`.**
The type is now `string | number | null` (was `string | number`).
