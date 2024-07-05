# Project Structure of the SAP AI SDK for JS

## Modules

- @ai-sdk-js/ai-core
    - AI Core generated client + types
    - Utility functions (if any)
- @ai-sdk-js/get-ai-hub 
    - Orchestration generated client
    - Wrappers/Utility functions
    - Client for LLM Access (Azure Openai and its types (Chat/Embeddings))
    - Depend on @ai-sdk-js/ai-core for fetching deploymentID (+other cases)
    - Common Http client code + types
    - Get ai-core service binding logic



