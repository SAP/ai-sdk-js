---
'@sap-ai-sdk/core': patch
---

[fix] Set the default http agent socket timeout for AI Core requests to 12 minutes (720000 ms).
This overrides the Cloud SDK default of 5 seconds, which is too short for chat and streaming completions.
Keep-alive is now disabled on these requests.
This avoids reusing stale sockets that a load balancer may have closed during the longer timeout.
Both settings apply only to the service-binding destination.
You can still override them with a custom destination's `agentOptions` or `CustomRequestConfig.httpsAgent`.
