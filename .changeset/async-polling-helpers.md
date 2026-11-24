---
"@sap-ai-sdk/core": minor
---

[feat] Add async polling helpers for long-running (202) calls.

`@sap-ai-sdk/core` now exports `waitUntilDone` and `poll`.
`waitUntilDone` runs a request and waits until it reaches a terminal state.
`poll` is a lower-level generator for driving the polling cadence yourself.
