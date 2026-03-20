---
'@sap-ai-sdk/orchestration': minor
---

[Improvement] Support file input for user messages.
File inputs have a `type` of `file` and include a `file_data` field with a URL such as a HTTP URL or a data URL.
Local files must be provided as `data:MEDIATYPE;base64,DATA` with a non-empty media type and valid base64 content.
Availability of different file types depends on the capabilities of the underlying model and tools.
GPT-models do not support file inputs with the orchestration API at this time.
