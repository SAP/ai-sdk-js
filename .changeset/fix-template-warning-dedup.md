---
'@sap-ai-sdk/orchestration': patch
'@sap-ai-sdk/langchain': patch
---

[fix] Fix duplicate template warnings in `OrchestrationClient` and LangChain adapter.

- Removed the `logger.warn` from `constructCompletionPostRequest` so the request builder is side-effect-free.
- Template warning logic now lives exclusively in client instances where per-instance state can deduplicate correctly.
- Config shape (inline template vs. template_ref) is now resolved once at construction time rather than on every call.
- Added `isInlineTemplate` type predicate to `orchestration-types.ts`.
- Replaced `isFirstCall` with `hasBeenCalledOnce` in the LangChain `OrchestrationClient` for clearer semantics.
