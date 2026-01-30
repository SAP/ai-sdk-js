---
'@sap-ai-sdk/rpt': minor
---

[feat] Add predict request compression support.
All requests with a body of 1024 bytes or larger will be automatically compressed with `gzip` by default, unless configured otherwise.
Compression configuration is available via the `requestCompression` property on the `RptClientConfig` object.
Supported compression algorithms include `gzip`, `brotli`, `deflate`, and `zstd` (requires Node.js v22.15.0+).
