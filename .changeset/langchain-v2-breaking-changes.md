---
'@sap-ai-sdk/langchain': major
---

[Compatibility Note] Major breaking changes for LangChain orchestration v2:
- Update LangChain orchestration configuration structure to use `promptTemplating` instead of separate `llm` and `templating` properties.
- Replace `llm.model_name` with `promptTemplating.model.name` and `llm.model_params` with `promptTemplating.model.params`.
- The `templating.template` property is now `promptTemplating.prompt.template`.
- Rename `inputParams` parameter to `placeholderValues` in LangChain orchestration client methods.
- Update message response property names from `module_results` to `intermediate_results` in additional kwargs.
