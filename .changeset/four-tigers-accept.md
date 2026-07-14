---
"@sap-ai-sdk/langchain": minor
---

[feat] Add `cache_control` call option to the LangChain orchestration client.
When the `cache_control` option is set (directly or via the `orchestrationPromptCachingMiddleware()` middleware), a cache breakpoint is automatically applied to the request.
  
