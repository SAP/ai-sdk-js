# Sample Code

Sample code to demonstrate the usage of the SAP Cloud SDK for AI.
Parts of the sample code are also used in E2E tests.

### Table of Contents

- [Local Deployment](#local-deployment)
- [Usage](#usage)
  - [AI API](#ai-api)
  - [Foundation Models (Azure OpenAI)](#foundation-models-azure-openai)
  - [Orchestration](#orchestration)
  - [Langchain](#langchain)
  - [Document Grounding](#document-grounding)

## Local Deployment

1. Run `pnpm install` to install dependencies.
2. Create a `.env` file in the `sample-code` directory with the complete content of your AI core service key by adding the following line:

   ```bash
   AICORE_SERVICE_KEY='{
     "clientid": "...",
     ...
   }'
   ```

3. Run `pnpm local` to start the server.

## Usage

### AI API

#### Get all Deployments

`GET /ai-api/deployments`

Get all deployments in resource group `default`.

#### Get all Deployments with Custom Destination

`GET /ai-api/deployments-with-destination`

Get all deployments targeting a custom destination.
Provide a destination when calling the `execute()` method.

#### Create a Deployment

`POST /ai-api/deployment/create`

```json
{
  "configurationId": "CONFIGURATION_ID"
}
```

Create a deployment with certain configuration ID in resource group `default`.

#### Batch Stop Deployments with Given Configuration ID

`PATCH /ai-api/deployment/batch-stop`

```json
{
  "configurationId": "CONFIGURATION_ID"
}
```

Stop all deployments with a certain configuration ID in resource group `default`.

#### Batch Delete all Deployments with Status `STOPPED` or `UNKNOWN`

`DELETE /ai-api/deployment/batch-delete`

Delete all deployments with status `STOPPED` or `UNKNOWN` in resource group `default`.

#### Get all Scenarios

`GET /ai-api/scenarios`

Get all scenarios in resource group `default`.

#### Get all Foundation Models

`GET /ai-api/models`

Get all foundation models in resource group `default`.

### Foundation Models (Azure OpenAI)

#### Chat Completion

`GET /azure-openai/chat-completion`

Get chat completion response.

#### Chat Completion with Custom Destination

`GET /azure-openai/chat-completion-with-destination`

Get chat completion response targeting a custom destination.
Provide a destination when initializing the `AzureOpenAiChatClient`.

#### Chat Completion Streaming

`GET /azure-openai/chat-completion-stream`

Get chat completion response with streaming.

The response header is set with `Content-Type: text/event-stream` to stream the text.

`AbortController` is used to cancel the request in case user closes or refreshes the page, or there is an error.

The `toContentStream()` method is called to extract the content of the chunk for convenience.

Once the streaming is done, finish reason and token usage are printed out.

#### Embedding

`GET /azure-openai/embedding`

Get embedding vector for the input.

### Orchestration

#### Simple Chat Completion

`GET /orchestration/simple`

Get chat completion response for a given static input.

#### Templating

`GET /orchestration/template`

Get chat completion response with template and input parameters.
Define variable by wrapping it with `{{?...}}`.

#### Image Recognition

`GET /orchestration/image`

Get chat completion response with image input.

#### Input Filtering

`GET /orchestration/inputFiltering`

Get chat completion response with Azure content filter for the input.
Use `buildAzureContentFilter()` to build the content filter.

#### Output Filtering

`GET /orchestration/outputFiltering`

Get chat completion response with Azure content filter for the output.
Use `buildAzureContentFilter()` to build the content filter.

#### Custom Request Config

`GET /orchestration/requestConfig`

Send chat completion request with a custom header as the custom request configuration.

#### Chat Completion Streaming

`POST /orchestration-stream/chat-completion-stream`

Get a chat completion response with streaming.

You can set the streaming options in the body of the request.

An example for setting the chunk size would look like this:

```
curl -X POST http://localhost:8080/orchestration-stream/chat-completion-stream \
-H "Content-Type: application/json" \
-d '{
  "global": {
    "chunk_size": 10
  }
}'
```

The response header is set with `Content-Type: text/event-stream` to stream the text.

`AbortController` is used to cancel the request in case user closes or refreshes the page, or there is an error.

The `toContentStream()` method is called to extract the content of the chunk for convenience.

Once the streaming is done, finish reason and token usage are printed out.

#### Chat Completion Streaming With JSON Module Config

`GET /orchestration-stream/chat-completion-stream-json`

Get a chat completion response with streaming with a JSON Module Config initalized client.

The response header is set with `Content-Type: text/event-stream` to stream the text.

`AbortController` is used to cancel the request in case user closes or refreshes the page, or there is an error.

The `toContentStream()` method is called to extract the content of the chunk for convenience.

Once the streaming is done, finish reason and token usage are printed out.

### Langchain

#### Invoke with a Simple Input

`GET /langchain/invoke`

Invoke langchain Azure OpenAI client with a simple input to get chat completion response.

#### Invoke a Chain for Templating

`GET /langchain/invoke-chain`

Invoke chain to get chat completion response from Azure OpenAI.
The chain contains a template and a string parser.

#### Invoke a Chain for Retrieval-Augmented Generation (RAG)

`GET /langchain/invoke-rag-chain`

Invoke a chain to embed documents and get chat completion response with context from Azure OpenAI.
The chain performs RAG with the chat and embedding client.

### Document Grounding

#### E2E flow for Orchestration Grounding

`GET /document-grounding/invoke-orchestration-grounding`

This scenario demonstrates the end-to-end flow for creating collections and documents using the document grounding service, and then using the orchestration grounding to get a chat completion response with a retrieved context.

The flow will first create an empty collection and then add a document to it.
The document contains a statement with the current timestamp.
It will be retrieved with a user question asking for the latest timestamp by orchestration grounding module.
Then, orchestration service will send a chat completion request with the context to LLM.
The response should contain the same timestamp.

The created collection will be deleted at the end of the flow.

#### E2E flow for Retrieving Documents

`GET /document-grounding/invoke-retrieve-documents`

This scenario demonstrates the end-to-end flow for creating collections and documents using the document grounding service, and then retrieving the documents with a query.

The response should contain chunks of documents similar to the query.

The created collection will be deleted at the end of the flow.
