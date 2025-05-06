---
'@sap-ai-sdk/orchestration': minor
---

[Compatibility Note] Since `ChatMessage` type is now one of the many specific types such as `SystemChatMessage` and `UserChatMessage` with predefined roles in the orchestration service specification, always define type when creating objects of type `OrchestrationModuleConfig` and `TemplatingModuleConfig` to avoid `role` being any string.
