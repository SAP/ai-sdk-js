---
'@sap-ai-sdk/orchestration': major
---

[Compatibility Note] Major breaking changes for orchestration v2:
- Consolidate `llm` and `templating` modules into a single `promptTemplating` module.
- The `llm.model_name` property is now `promptTemplating.model.name` and `llm.model_params` is now `promptTemplating.model.params`.
- The `templating.template` property is now `promptTemplating.prompt.template`.
- Rename `inputParams` parameter to `placeholderValues` in orchestration client methods.
- Update response property names from `orchestration_result` to `final_result` and `module_results` to `intermediate_results`.
- Replace top-level `stream` property with `streamOptions.enabled` and update streaming module options from `llm` to `promptTemplating`.
- Update grounding configuration to use `placeholders.input` and `placeholders.output` instead of separate `input_params` and `output_param`.
- Update Azure content filter property names to lowercase with underscores: `Hate` to `hate`, `SelfHarm` to `self_harm`, `Sexual` to `sexual`, and `Violence` to `violence`.
- Remove deprecated `buildAzureContentFilter()` function and use `buildAzureContentSafetyFilter()` instead.
