---
"@sap-ai-sdk/orchestration": minor
---

[compat] The `messages` field on the request and the `prompt` field on the constructor `promptTemplating` module are deprecated.
Pass the current turn via the request-level `prompt` field instead.
