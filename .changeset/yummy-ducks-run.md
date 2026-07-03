---
'@sap-ai-sdk/orchestration': patch
---

[Fix] Route messages preceding tool messages from the `promptTemplating` section `messages` property to `messages_history` automatically if  no templating placeholder values are provided.
