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

## Local Deployment

1. Run `pnpm install` to install dependencies.
2. Create a `.env` file in the `sample-code` directory with your AI core service key by adding the following line:

   ```bash
   AICORE_SERVICE_KEY='SERVICE_KEY_JSON
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

`GET orchestration/template`

Get chat completion response with template and input parameters.
Define variable by wrapping it with `{{? ... }}`.

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
