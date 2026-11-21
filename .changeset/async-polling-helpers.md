---
"@sap-ai-sdk/core": minor
---

[feat] Add async polling helpers for long-running (202) calls.

Core now exports `pollEach` and `pollUntilTerminal`.
Use `createAndWait` and `deleteAndWait` to poll a call until it is done.
The context-registry and document-grounding packages add their own wrappers.
