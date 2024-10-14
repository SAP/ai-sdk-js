---
'@sap-ai-sdk/langchain': patch
---

[Fixed Issue] Fix performance issues when creating embeddings for split documents by sending all documents in one request instead of splitting it up in separate requests.
