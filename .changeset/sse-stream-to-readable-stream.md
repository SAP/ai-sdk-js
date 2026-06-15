---
'@sap-ai-sdk/core': minor
---

[feat] Add `toReadableStream()` method to `SseStream`.
The new method converts the async iterable stream to a pull-based `ReadableStream` of newline-delimited JSON, enabling composable transformations via the Web Streams API `pipeThrough()` pattern with native backpressure handling.
