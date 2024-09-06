# Project Structure of the SAP AI SDK for JS

## Modules

- @sap-ai-sdk/ai-api
    - AI Core generated client + types
    - Utility functions (if any)
- @sap-ai-sdk/gen-ai-hub 
    - Orchestration generated client
    - Wrappers/Utility functions
    - Client for LLM Access (Azure Openai and its types (Chat/Embeddings))
    - Depend on @sap-ai-sdk/ai-api for fetching deploymentID (+other cases) in the future
    - Common Http client code + types
    - Get ai-api service binding logic


