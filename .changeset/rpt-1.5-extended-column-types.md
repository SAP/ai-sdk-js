---
'@sap-ai-sdk/rpt': minor
---

[feat] **Extended column types.** Expand `ColumnType` from 3 to 16 values (`integer`, `int16`, `int32`, `int64`, `uint8`, `decimal`, `double`, `boolean`, `largestring`, `uuid`, `time`, `datetime`, `timestamp`).
Map the new numeric variants to `number`; all other new variants (including `datetime` and `timestamp`, which are full ISO strings) map to `string`.
