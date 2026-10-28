---
"@sap-ai-sdk/orchestration": patch
---

[Fixed Issue] Throw a clear error when a request-level `prompt` is passed to `chatCompletion()` or `stream()` on a client constructed with an orchestration config reference.
A config reference is single-turn and defines the template server-side, so a request-level `prompt` was previously dropped silently.
Use `messagesHistory` for prior turns instead.
