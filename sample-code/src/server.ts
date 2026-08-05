/* eslint-disable no-console */
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import {
  resolveDeploymentUrl,
  type AiDeploymentStatus
} from '@sap-ai-sdk/ai-api';
import {
  chatCompletion,
  chatCompletionStream as azureChatCompletionStream,
  chatCompletionWithDestination,
  computeEmbedding,
  chatCompletionWithFunctionCall
} from './foundation-models/azure-openai.ts';
import {
  chatCompletion as openAiSdkChatCompletion,
  chatCompletionStream as openAiSdkChatCompletionStream,
  chatCompletionParse as openAiSdkChatCompletionParse,
  computeEmbedding as openAiSdkComputeEmbedding,
  responsesApi,
  responsesApiStream,
  responsesApiParse,
  responsesApiStateful,
  responsesApiMultiTurn,
  chatCompletionPerRequestModel
} from './openai.ts';
import {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig,
  chatCompletionStream as orchestrationChatCompletionStream,
  orchestrationFromJson,
  orchestrationGrounding,
  orchestrationChatCompletionImage,
  orchestrationChatCompletionFile,
  chatCompletionStreamWithJsonModuleConfig as orchestrationChatCompletionStreamWithJsonModuleConfig,
  orchestrationMaskGroundingInput,
  orchestrationPromptRegistry,
  OrchestrationConfigRef,
  orchestrationMessageHistory,
  orchestrationResponseFormat,
  orchestrationTranslation,
  orchestrationEmbeddingWithMasking,
  orchestrationSapAbapChatCompletion,
  orchestrationWithFallbackConfigs,
  orchestrationSonarWithCitations,
  orchestrationCacheControl
} from './orchestration.ts';
import {
  getDeployments,
  getDeploymentsWithDestination,
  createDeployment,
  stopDeployments,
  deleteDeployments
} from './ai-api/deployment-api.ts';
import { getScenarios, getModelsInScenario } from './ai-api/scenario-api.ts';
import {
  invokeChain,
  invokeRagChain,
  invoke,
  invokeToolChain,
  streamChain,
  invokeWithStructuredOutputJsonSchema,
  invokeReasoningWithMaxTokens
} from './langchain-azure-openai.ts';
import {
  invokeChain as invokeChainOrchestration,
  invokeChainWithInputFilter as invokeChainWithInputFilterOrchestration,
  invokeChainWithOutputFilter as invokeChainWithOutputFilterOrchestration,
  invokeLangGraphChain as invokeLangGraphChainOrchestration,
  invokeChainWithMasking,
  invokeToolChain as invokeToolChainOrchestration,
  streamChain as streamChainOrchestration,
  invokeMcpToolChain as invokeMcpToolChainOrchestration,
  invokeWithStructuredOutput as orchestrationInvokeWithStructuredOutput,
  invokeDynamicModelAgent
} from './langchain-orchestration.ts';
import {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  retrieveDocuments
} from './document-grounding.ts';
import {
  createPromptTemplate,
  deletePromptTemplate
} from './prompt-registry.ts';
import {
  listBatches,
  createBatch,
  getBatchById,
  getBatchStatus,
  cancelBatch,
  deleteBatch
} from './llm-batch.ts';
import {
  predictAutomaticParsing,
  predictWithSchema,
  predictParquetBlob
} from './rpt.ts';
import type { RetrievalPerFilterSearchResult } from '@sap-ai-sdk/document-grounding';
import type { AIMessageChunk } from '@langchain/core/messages';
import type {
  OrchestrationEmbeddingResponse,
  OrchestrationResponse
} from '@sap-ai-sdk/orchestration';
import { stream } from 'hono/streaming';

const app = new OpenAPIHono();
const port = 8080;

/* ── helpers ────────────────────────────────────────────────────────────── */

function errorStatus(error: any): ContentfulStatusCode {
  return (error.cause?.status ?? 500) as ContentfulStatusCode;
}

function errorBody(error: any): string {
  return error.cause?.response?.data ?? error.message;
}

/* ── health ─────────────────────────────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Health'],
    summary: 'Health check',
    responses: { 200: { description: 'OK' } }
  }),
  c =>
    c.html(
      '<html><body><p>Hello World! 🌍</p><p><a href="/docs">API Docs (Swagger UI)</a></p></body></html>'
    )
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/health',
    tags: ['Health'],
    summary: 'Health check',
    responses: { 200: { description: 'OK' } }
  }),
  c => c.text('Hello World! 🌍')
);

/* ── AI API ─────────────────────────────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/ai-api/deployments',
    tags: ['AI API'],
    summary: 'List deployments',
    request: {
      query: z.object({ status: z.string().optional() })
    },
    responses: { 200: { description: 'Deployments list' } }
  }),
  async c => {
    try {
      return c.json(
        await getDeployments(
          'default',
          c.req.query('status') as AiDeploymentStatus
        )
      );
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/ai-api/deployments-with-destination',
    tags: ['AI API'],
    summary: 'List deployments with destination',
    request: {
      query: z.object({ status: z.string().optional() })
    },
    responses: { 200: { description: 'Deployments list' } }
  }),
  async c => {
    try {
      return c.json(
        await getDeploymentsWithDestination(
          'default',
          c.req.query('status') as AiDeploymentStatus
        )
      );
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'post',
    path: '/ai-api/deployment/create',
    tags: ['AI API'],
    summary: 'Create deployment',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({ configurationId: z.string() })
          }
        }
      }
    },
    responses: { 200: { description: 'Created deployment' } }
  }),
  async c => {
    try {
      const { configurationId } = await c.req.json();
      return c.json(await createDeployment(configurationId, 'default'));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'patch',
    path: '/ai-api/deployment/batch-stop',
    tags: ['AI API'],
    summary: 'Batch stop deployments',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({ configurationId: z.string() })
          }
        }
      }
    },
    responses: { 200: { description: 'Stopped deployments' } }
  }),
  async c => {
    try {
      const { configurationId } = await c.req.json();
      return c.json(await stopDeployments(configurationId, 'default'));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'delete',
    path: '/ai-api/deployment/batch-delete',
    tags: ['AI API'],
    summary: 'Batch delete deployments',
    responses: { 200: { description: 'Deleted deployments' } }
  }),
  async c => {
    try {
      return c.json(await deleteDeployments('default'));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/ai-api/scenarios',
    tags: ['AI API'],
    summary: 'List scenarios',
    responses: { 200: { description: 'Scenarios list' } }
  }),
  async c => {
    try {
      return c.json(await getScenarios('default'));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/ai-api/models',
    tags: ['AI API'],
    summary: 'List models in foundation-models scenario',
    responses: { 200: { description: 'Models list' } }
  }),
  async c => {
    try {
      return c.json(await getModelsInScenario('foundation-models', 'default'));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/ai-api/deployment-url',
    tags: ['AI API'],
    summary: 'Resolve deployment URL for gpt-5.4',
    responses: { 200: { description: 'Deployment URL' } }
  }),
  async c => {
    try {
      return c.text(
        (await resolveDeploymentUrl({
          scenarioId: 'foundation-models',
          model: { name: 'gpt-5.4' }
        })) ?? ''
      );
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

/* ── Foundation Models (Azure OpenAI) ──────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/azure-openai/chat-completion',
    tags: ['Azure OpenAI'],
    summary: 'Chat completion',
    responses: { 200: { description: 'Chat response' } }
  }),
  async c => {
    try {
      const response = await chatCompletion();
      return c.text(String(response.getContent() ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/azure-openai/chat-completion-with-destination',
    tags: ['Azure OpenAI'],
    summary: 'Chat completion with destination',
    responses: { 200: { description: 'Chat response' } }
  }),
  async c => {
    try {
      const response = await chatCompletionWithDestination();
      return c.text(String(response.getContent() ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/azure-openai/chat-completion-stream',
    tags: ['Azure OpenAI'],
    summary: 'Chat completion (streaming)',
    responses: { 200: { description: 'SSE stream' } }
  }),
  async c => {
    const controller = new AbortController();
    return stream(c, async s => {
      s.onAbort(() => controller.abort());
      try {
        const response = await azureChatCompletionStream(controller.signal);
        for await (const chunk of response.stream.toContentStream()) {
          await s.write(chunk);
        }
        const finishReason = response.getFinishReason();
        const tokenUsage = response.getTokenUsage()!;
        await s.write('\n\n---------------------------\n');
        await s.write(`Finish reason: ${finishReason}\n`);
        await s.write('Token usage:\n');
        await s.write(
          `  - Completion tokens: ${tokenUsage.completion_tokens}\n`
        );
        await s.write(`  - Prompt tokens: ${tokenUsage.prompt_tokens}\n`);
        await s.write(`  - Total tokens: ${tokenUsage.total_tokens}\n`);
      } catch (error: any) {
        console.error(error.stack);
      }
    });
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/azure-openai/embedding',
    tags: ['Azure OpenAI'],
    summary: 'Compute embedding',
    responses: { 200: { description: 'Embedding result' } }
  }),
  async c => {
    try {
      const response = await computeEmbedding();
      if (!response.getEmbedding()?.length) {
        return c.text(
          'No embedding vector returned.',
          500 as ContentfulStatusCode
        );
      }
      return c.text('Number crunching success, got a nice vector.');
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/azure-openai/invoke-tool-chain',
    tags: ['Azure OpenAI'],
    summary: 'Chat completion with function call',
    responses: { 200: { description: 'Tool chain response' } }
  }),
  async c => {
    try {
      const response = await chatCompletionWithFunctionCall();
      return c.text(String(response.getContent() ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

/* ── Foundation Models (OpenAI SDK) ────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/chat-completion',
    tags: ['OpenAI SDK'],
    summary: 'Chat completion',
    responses: { 200: { description: 'Chat response' } }
  }),
  async c => {
    try {
      return c.text(String((await openAiSdkChatCompletion()) ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/chat-completion-stream',
    tags: ['OpenAI SDK'],
    summary: 'Chat completion (streaming)',
    responses: { 200: { description: 'SSE stream' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const chunks = await openAiSdkChatCompletionStream();
        for await (const chunk of chunks) {
          await s.write(chunk.choices[0]?.delta?.content ?? '');
        }
      } catch (error: any) {
        console.error(error.stack);
      }
    })
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/chat-completion-parse',
    tags: ['OpenAI SDK'],
    summary: 'Chat completion with parsing',
    responses: { 200: { description: 'Parsed response' } }
  }),
  async c => {
    try {
      return c.text(String((await openAiSdkChatCompletionParse()) ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/chat-completion-per-request-model',
    tags: ['OpenAI SDK'],
    summary: 'Chat completion with per-request model',
    responses: { 200: { description: 'Chat response' } }
  }),
  async c => {
    try {
      return c.text(String((await chatCompletionPerRequestModel()) ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/embedding',
    tags: ['OpenAI SDK'],
    summary: 'Compute embedding',
    responses: { 200: { description: 'Embedding dimensions' } }
  }),
  async c => {
    try {
      const embedding = await openAiSdkComputeEmbedding();
      return c.text(
        `Got embedding vector with ${embedding.length} dimensions.`
      );
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/responses',
    tags: ['OpenAI SDK'],
    summary: 'Responses API',
    responses: { 200: { description: 'Response' } }
  }),
  async c => {
    try {
      return c.text(String((await responsesApi()) ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/responses-stream',
    tags: ['OpenAI SDK'],
    summary: 'Responses API (streaming)',
    responses: { 200: { description: 'SSE stream' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const events = await responsesApiStream();
        for await (const event of events) {
          if (event.type === 'response.output_text.delta') {
            await s.write(event.delta ?? '');
          }
        }
      } catch (error: any) {
        console.error(error.stack);
      }
    })
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/responses-parse',
    tags: ['OpenAI SDK'],
    summary: 'Responses API with parsing',
    responses: { 200: { description: 'Parsed response' } }
  }),
  async c => {
    try {
      return c.text(String((await responsesApiParse()) ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/responses-stateful',
    tags: ['OpenAI SDK'],
    summary: 'Responses API (stateful)',
    responses: { 200: { description: 'Response' } }
  }),
  async c => {
    try {
      return c.text(String((await responsesApiStateful()) ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/openai/responses-multi-turn',
    tags: ['OpenAI SDK'],
    summary: 'Responses API (multi-turn)',
    responses: { 200: { description: 'Response' } }
  }),
  async c => {
    try {
      return c.text(String((await responsesApiMultiTurn()) ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

/* ── Orchestration ──────────────────────────────────────────────────────── */

const orchestrationSampleCases = [
  'simple',
  'template',
  'templateRef',
  'configReference',
  'messageHistory',
  'inputFiltering',
  'outputFiltering',
  'requestConfig',
  'fromJson',
  'image',
  'responseFormat',
  'maskGroundingInput',
  'translation',
  'embeddingWithMasking',
  'sapAbap',
  'fallbackModules',
  'sonarWithCitations',
  'cacheControl'
] as const;

app.openapi(
  createRoute({
    method: 'get',
    path: '/orchestration/file',
    tags: ['Orchestration'],
    summary: 'Chat completion with file input',
    request: {
      query: z.object({
        type: z.enum(['pdf', 'csv', 'docx', 'mp3']),
        model: z.string().optional()
      })
    },
    responses: { 200: { description: 'File chat response' } }
  }),
  async c => {
    const fileType = c.req.query('type') as 'pdf' | 'csv' | 'docx' | 'mp3';
    const model = c.req.query('model');
    try {
      const result = await orchestrationChatCompletionFile(fileType, { model });
      return c.text(String(result.getContent() ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/orchestration/{sampleCase}',
    tags: ['Orchestration'],
    summary: 'Run orchestration sample case',
    request: {
      params: z.object({ sampleCase: z.enum(orchestrationSampleCases) })
    },
    responses: { 200: { description: 'Sample case result' } }
  }),
  async c => {
    const sampleCase = c.req.param('sampleCase');

    const testCase =
      {
        simple: orchestrationChatCompletion,
        template: orchestrationTemplating,
        templateRef: orchestrationPromptRegistry,
        configReference: OrchestrationConfigRef,
        messageHistory: orchestrationMessageHistory,
        inputFiltering: orchestrationInputFiltering,
        outputFiltering: orchestrationOutputFiltering,
        requestConfig: orchestrationRequestConfig,
        fromJson: orchestrationFromJson,
        image: orchestrationChatCompletionImage,
        responseFormat: orchestrationResponseFormat,
        maskGroundingInput: orchestrationMaskGroundingInput,
        translation: orchestrationTranslation,
        embeddingWithMasking: orchestrationEmbeddingWithMasking,
        sapAbap: orchestrationSapAbapChatCompletion,
        fallbackModules: orchestrationWithFallbackConfigs,
        sonarWithCitations: orchestrationSonarWithCitations,
        cacheControl: orchestrationCacheControl
      }[sampleCase] || orchestrationChatCompletion;

    try {
      const result = await testCase();
      if (sampleCase === 'inputFiltering') {
        return c.text(
          `Input filter applied successfully with response:\n${JSON.stringify(result, null, 2)}`
        );
      }
      if (sampleCase === 'outputFiltering') {
        return c.text(
          `Output filter applied successfully with threshold results:\n${JSON.stringify((result as OrchestrationResponse).getIntermediateResults().output_filtering!.data!, null, 2)}`
        );
      }
      if (sampleCase === 'responseFormat') {
        return c.text(
          `Response format applied successfully with response:\n${JSON.stringify(result, null, 2)}`
        );
      }
      if (sampleCase === 'embeddingWithMasking') {
        const embeddingResult = result as OrchestrationEmbeddingResponse;
        const embedding = embeddingResult
          .getEmbeddings()
          .map(item => item.embedding);
        return c.text(
          `Embedding with masking applied successfully:${JSON.stringify(embeddingResult.getIntermediateResults()?.input_masking?.data, null, 2)}\nEmbeddings: ${embedding}\nUsage - Prompt tokens: ${embeddingResult.getTokenUsage()?.prompt_tokens}\nUsage - Total tokens: ${embeddingResult.getTokenUsage()?.total_tokens}`
        );
      }
      if (sampleCase === 'fallbackModules') {
        const intermediateFailures = (
          result as OrchestrationResponse
        ).getIntermediateFailures();
        const content = (result as OrchestrationResponse).getContent();
        return c.text(
          `Fallback modules executed successfully.\nIntermediate Failures: ${JSON.stringify(intermediateFailures, null, 2)}\nFinal Content: ${content}`
        );
      }
      if (sampleCase === 'sonarWithCitations') {
        const sonarResult = result as OrchestrationResponse;
        const content = sonarResult.getContent();
        const citations = sonarResult.getCitations();
        let response = `Response: ${content}\n\n`;
        if (citations?.length) {
          response += 'Citations:\n';
          response +=
            citations
              .map(
                citation =>
                  `  [${citation.ref_id ?? ''}] ${citation.title}: ${citation.url}`
              )
              .join('\n') + '\n';
        } else {
          response += 'No citations found in the response.\n';
        }
        return c.text(response);
      }
      if (sampleCase === 'cacheControl') {
        const [first, second] = result as [
          OrchestrationResponse,
          OrchestrationResponse
        ];
        const firstUsage = first.getTokenUsage();
        const secondUsage = second.getTokenUsage();
        return c.text(
          '--- First call (cache write) ---\n' +
            `Response: ${first.getContent()}\n` +
            `Cache tokens created: ${firstUsage.prompt_tokens_details?.cache_creation_tokens ?? 0}\n` +
            `Cache tokens read: ${firstUsage.prompt_tokens_details?.cached_tokens ?? 0}\n\n` +
            '--- Second call (cache read) ---\n' +
            `Response: ${second.getContent()}\n` +
            `Cache tokens created: ${secondUsage.prompt_tokens_details?.cache_creation_tokens ?? 0}\n` +
            `Cache tokens read: ${secondUsage.prompt_tokens_details?.cached_tokens ?? 0}`
        );
      }
      return c.text((result as OrchestrationResponse).getContent() ?? '');
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'post',
    path: '/orchestration-stream/chat-completion-stream',
    tags: ['Orchestration'],
    summary: 'Orchestration chat completion (streaming)',
    request: {
      body: {
        content: { 'application/json': { schema: z.object({}).passthrough() } }
      }
    },
    responses: { 200: { description: 'SSE stream' } }
  }),
  async c => {
    const controller = new AbortController();
    const body = await c.req.json().catch(() => ({}));
    return stream(c, async s => {
      s.onAbort(() => controller.abort());
      try {
        const response = await orchestrationChatCompletionStream(
          controller,
          body
        );
        for await (const chunk of response.stream) {
          await s.write(chunk.getDeltaContent() + '\n');
        }
        const finishReason = response.getFinishReason();
        const tokenUsage = response.getTokenUsage();
        await s.write('\n\n---------------------------\n');
        await s.write(`Finish reason: ${finishReason}\n`);
        await s.write('Token usage:\n');
        await s.write(
          `  - Completion tokens: ${tokenUsage?.completion_tokens}\n`
        );
        await s.write(`  - Prompt tokens: ${tokenUsage?.prompt_tokens}\n`);
        await s.write(`  - Total tokens: ${tokenUsage?.total_tokens}\n`);
      } catch (error: any) {
        console.error(error.stack);
      }
    });
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/orchestration-stream/chat-completion-stream-json',
    tags: ['Orchestration'],
    summary: 'Orchestration chat completion stream with JSON module config',
    responses: { 200: { description: 'SSE stream' } }
  }),
  async c => {
    const controller = new AbortController();
    return stream(c, async s => {
      s.onAbort(() => controller.abort());
      try {
        const response =
          await orchestrationChatCompletionStreamWithJsonModuleConfig(
            controller
          );
        for await (const chunk of response.stream) {
          await s.write(chunk.getDeltaContent() + '\n');
        }
        const finishReason = response.getFinishReason();
        const tokenUsage = response.getTokenUsage();
        await s.write('\n\n---------------------------\n');
        await s.write(`Finish reason: ${finishReason}\n`);
        await s.write('Token usage:\n');
        await s.write(
          `  - Completion tokens: ${tokenUsage?.completion_tokens}\n`
        );
        await s.write(`  - Prompt tokens: ${tokenUsage?.prompt_tokens}\n`);
        await s.write(`  - Total tokens: ${tokenUsage?.total_tokens}\n`);
      } catch (error: any) {
        console.error(error.stack);
      }
    });
  }
);

/* ── LangChain ──────────────────────────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke',
    tags: ['LangChain'],
    summary: 'Invoke LangChain chain (Azure OpenAI)',
    responses: { 200: { description: 'Chain result' } }
  }),
  async c => {
    try {
      return c.text(await invoke());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-reasoning-with-max-tokens',
    tags: ['LangChain'],
    summary: 'Invoke reasoning with max tokens',
    responses: { 200: { description: 'Chain result' } }
  }),
  async c => {
    try {
      return c.text(await invokeReasoningWithMaxTokens());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-with-structured-output',
    tags: ['LangChain'],
    summary: 'Invoke with structured output (JSON schema)',
    responses: { 200: { description: 'Structured output' } }
  }),
  async c => {
    try {
      return c.json(await invokeWithStructuredOutputJsonSchema());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-with-structured-output-orchestration',
    tags: ['LangChain'],
    summary: 'Invoke with structured output (orchestration)',
    request: {
      query: z.object({
        method: z
          .enum(['functionCalling', 'jsonMode', 'jsonSchema'])
          .optional()
          .default('jsonSchema'),
        includeRaw: z.string().optional()
      })
    },
    responses: {
      200: { description: 'Structured output' },
      400: { description: 'Invalid method' }
    }
  }),
  async c => {
    const validMethods = ['functionCalling', 'jsonMode', 'jsonSchema'] as const;
    const method = (c.req.query('method') ?? 'jsonSchema') as string;
    if (!validMethods.includes(method as (typeof validMethods)[number])) {
      return c.json(
        {
          error: `Invalid method '${method}'. Valid methods are: ${validMethods.join(', ')}.`
        },
        400
      );
    }
    const includeRaw =
      c.req.query('includeRaw') === 'true' || c.req.query('includeRaw') === '1';
    try {
      return c.json(
        await orchestrationInvokeWithStructuredOutput(
          method as (typeof validMethods)[number],
          includeRaw
        )
      );
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-chain',
    tags: ['LangChain'],
    summary: 'Invoke chain (Azure OpenAI)',
    responses: { 200: { description: 'Chain result' } }
  }),
  async c => {
    try {
      return c.text(await invokeChain());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-chain-orchestration',
    tags: ['LangChain'],
    summary: 'Invoke chain (orchestration)',
    responses: { 200: { description: 'Chain result' } }
  }),
  async c => {
    try {
      return c.json(await invokeChainOrchestration());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-chain-orchestration-input-filter',
    tags: ['LangChain'],
    summary: 'Invoke chain with input filter (orchestration)',
    responses: { 200: { description: 'Chain result' } }
  }),
  async c => {
    try {
      return c.json(await invokeChainWithInputFilterOrchestration());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-chain-orchestration-output-filter',
    tags: ['LangChain'],
    summary: 'Invoke chain with output filter (orchestration)',
    responses: { 200: { description: 'Chain result' } }
  }),
  async c => {
    try {
      return c.json(await invokeChainWithOutputFilterOrchestration());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-chain-orchestration-masking',
    tags: ['LangChain'],
    summary: 'Invoke chain with masking (orchestration)',
    responses: { 200: { description: 'Chain result' } }
  }),
  async c => {
    try {
      return c.json(await invokeChainWithMasking());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-rag-chain',
    tags: ['LangChain'],
    summary: 'Invoke RAG chain',
    responses: { 200: { description: 'RAG result' } }
  }),
  async c => {
    try {
      return c.text(await invokeRagChain());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-tool-chain',
    tags: ['LangChain'],
    summary: 'Invoke tool chain (Azure OpenAI)',
    responses: { 200: { description: 'Tool chain result' } }
  }),
  async c => {
    try {
      return c.text(await invokeToolChain());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-mcp-tool-chain',
    tags: ['LangChain'],
    summary: 'Invoke MCP tool chain (orchestration)',
    responses: { 200: { description: 'MCP tool chain result' } }
  }),
  async c => {
    try {
      return c.text(await invokeMcpToolChainOrchestration());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-tool-chain-orchestration',
    tags: ['LangChain'],
    summary: 'Invoke tool chain (orchestration)',
    responses: { 200: { description: 'Tool chain result' } }
  }),
  async c => {
    try {
      return c.text(await invokeToolChainOrchestration());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-stateful-chain',
    tags: ['LangChain'],
    summary: 'Invoke stateful LangGraph chain (orchestration)',
    responses: { 200: { description: 'Stateful chain result' } }
  }),
  async c => {
    try {
      return c.text(await invokeLangGraphChainOrchestration());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/invoke-dynamic-model-agent',
    tags: ['LangChain'],
    summary: 'Invoke dynamic model agent',
    responses: { 200: { description: 'Agent result' } }
  }),
  async c => {
    try {
      return c.text(await invokeDynamicModelAgent());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/stream-azure-openai',
    tags: ['LangChain'],
    summary: 'Stream chain (Azure OpenAI)',
    responses: { 200: { description: 'SSE stream' } }
  }),
  async c => {
    const controller = new AbortController();
    return stream(c, async s => {
      s.onAbort(() => controller.abort());
      try {
        const chunks = await streamChain(controller);
        let finalResult: AIMessageChunk | undefined;
        for await (const chunk of chunks) {
          await s.write(chunk.content as string);
          finalResult = finalResult ? finalResult.concat(chunk) : chunk;
        }
        console.log(JSON.stringify(finalResult, null, 2));
        if (finalResult?.usage_metadata) {
          await s.write('\n\n---------------------------\n');
          await s.write(
            `Finish reason:  ${finalResult.response_metadata?.finish_reason}\n`
          );
          await s.write('Token usage:\n');
          await s.write(
            `  - Completion tokens: ${finalResult.usage_metadata?.output_tokens}\n`
          );
          await s.write(
            `  - Prompt tokens: ${finalResult.usage_metadata?.input_tokens}\n`
          );
          await s.write(
            `  - Total tokens: ${finalResult.usage_metadata?.total_tokens}\n`
          );
        }
      } catch (error: any) {
        console.error(error.stack);
      }
    });
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/langchain/stream-orchestration',
    tags: ['LangChain'],
    summary: 'Stream chain (orchestration)',
    responses: { 200: { description: 'SSE stream' } }
  }),
  async c => {
    const controller = new AbortController();
    return stream(c, async s => {
      s.onAbort(() => controller.abort());
      try {
        const chunks = await streamChainOrchestration(controller);
        let finalResult: AIMessageChunk | undefined;
        for await (const chunk of chunks) {
          await s.write(chunk.content as string);
          finalResult = finalResult ? finalResult.concat(chunk) : chunk;
        }
        console.log(JSON.stringify(finalResult, null, 2));
        if (finalResult?.usage_metadata) {
          await s.write('\n\n---------------------------\n');
          await s.write(
            `Finish reason:  ${finalResult.response_metadata?.finish_reason}\n`
          );
          await s.write('Token usage:\n');
          await s.write(
            `  - Completion tokens: ${finalResult.usage_metadata?.output_tokens}\n`
          );
          await s.write(
            `  - Prompt tokens: ${finalResult.usage_metadata?.input_tokens}\n`
          );
          await s.write(
            `  - Total tokens: ${finalResult.usage_metadata?.total_tokens}\n`
          );
        }
      } catch (error: any) {
        console.error(error.stack);
      }
    });
  }
);

/* ── Document Grounding ─────────────────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/document-grounding/orchestration-grounding-vector',
    tags: ['Document Grounding'],
    summary: 'Create collection, ground, delete collection (vector)',
    responses: { 200: { description: 'SSE stream of operations' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const collectionId = await createCollection();
        await s.write(`Collection created:\t\t\t${collectionId}\n`);

        const timestamp = Date.now();
        await createDocumentsWithTimestamp(collectionId, timestamp);
        await s.write(`Document created with timestamp:\t${timestamp}\n`);

        const groundingResult = await orchestrationGrounding(
          'When was the last time SAP AI SDK JavaScript end to end test was executed? Return only the latest timestamp in milliseconds without any other text.'
        );
        await s.write(
          `Orchestration responded with timestamp:\t${groundingResult.getContent()}\n`
        );

        const groundingResultString =
          groundingResult.getIntermediateResults().grounding?.data
            ?.grounding_result;
        await s.write(
          `Orchestration grounding metadata:\t${JSON.stringify(JSON.parse(groundingResultString)[0].metadata)}\n`
        );

        await deleteCollection(collectionId);
        await s.write(`Collection deleted:\t\t\t${collectionId}\n`);
      } catch (error: any) {
        console.error(error.stack);
        await s.write(`Error: ${errorBody(error)}\n`);
      }
    })
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/document-grounding/retrieve-documents',
    tags: ['Document Grounding'],
    summary: 'Create collection, retrieve documents, delete collection',
    responses: { 200: { description: 'SSE stream of operations' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const collectionId = await createCollection();
        await s.write(`Collection created:\t\t\t${collectionId}\n`);

        const timestamp = Date.now();
        await createDocumentsWithTimestamp(collectionId, timestamp);
        await s.write(`Document created with timestamp:\t${timestamp}\n`);

        const retrievalResult = await retrieveDocuments(
          'When was the last time SAP AI SDK JavaScript end to end test was executed?'
        );

        console.log(JSON.stringify(retrievalResult));

        await s.write('Retrieved documents:\n');
        for (const perFilterSearchResult of retrievalResult.results as RetrievalPerFilterSearchResult[]) {
          await s.write(`  - Filter: ${perFilterSearchResult.filterId}\n`);
          for (const retievalDataRepositorySearchResult of perFilterSearchResult.results!) {
            await s.write(
              `    - Data repository: ${retievalDataRepositorySearchResult.dataRepository.title}\n`
            );
            for (const retrievalDocument of retievalDataRepositorySearchResult
              .dataRepository.documents) {
              for (const chunk of retrievalDocument.chunks) {
                await s.write(`      - Chunk: ${chunk.content}\n`);
              }
            }
          }
        }

        await deleteCollection(collectionId);
        await s.write(`Collection deleted:\t\t\t${collectionId}\n`);
      } catch (error: any) {
        console.error(error.stack);
        await s.write(`Error: ${errorBody(error)}\n`);
      }
    })
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/document-grounding/orchestration-grounding-help-sap-com',
    tags: ['Document Grounding'],
    summary: 'Grounding via help.sap.com',
    responses: { 200: { description: 'Grounding result' } }
  }),
  async c => {
    try {
      const groundingResult = await orchestrationGrounding(
        'Give me a short introduction of SAP AI Core.',
        'help.sap.com'
      );
      return c.text(String(groundingResult.getContent() ?? ''));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

/* ── Prompt Registry ────────────────────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/prompt-registry/template',
    tags: ['Prompt Registry'],
    summary: 'Create and delete a prompt template',
    responses: { 200: { description: 'SSE stream of operations' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const { id } = await createPromptTemplate(
          'ai-sdk-js-sample',
          'orchestration'
        );
        await s.write(`Prompt template created: ${id}\n`);

        const response = await deletePromptTemplate(id);
        await s.write(`Prompt template deleted: ${response.message}\n`);
      } catch (error: any) {
        console.error(error.stack);
        await s.write(`Error: ${errorBody(error)}\n`);
      }
    })
);

/* ── LLM Batch ──────────────────────────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/llm-batch/batches',
    tags: ['LLM Batch'],
    summary: 'List batches',
    responses: { 200: { description: 'Batches list' } }
  }),
  async c => {
    try {
      return c.json(await listBatches());
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'post',
    path: '/llm-batch/batches',
    tags: ['LLM Batch'],
    summary: 'Create batch',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              inputUri: z.string(),
              outputUri: z.string()
            })
          }
        }
      }
    },
    responses: { 200: { description: 'Created batch' } }
  }),
  async c => {
    try {
      const { inputUri, outputUri } = await c.req.json();
      return c.json(await createBatch(inputUri, outputUri));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/llm-batch/batches/{batchId}',
    tags: ['LLM Batch'],
    summary: 'Get batch by ID',
    request: {
      params: z.object({ batchId: z.string() })
    },
    responses: { 200: { description: 'Batch details' } }
  }),
  async c => {
    try {
      return c.json(await getBatchById(c.req.param('batchId')));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/llm-batch/batches/{batchId}/status',
    tags: ['LLM Batch'],
    summary: 'Get batch status',
    request: {
      params: z.object({ batchId: z.string() })
    },
    responses: { 200: { description: 'Batch status' } }
  }),
  async c => {
    try {
      return c.json(await getBatchStatus(c.req.param('batchId')));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'patch',
    path: '/llm-batch/batches/{batchId}/cancel',
    tags: ['LLM Batch'],
    summary: 'Cancel batch',
    request: {
      params: z.object({ batchId: z.string() })
    },
    responses: { 200: { description: 'Cancelled batch' } }
  }),
  async c => {
    try {
      return c.json(await cancelBatch(c.req.param('batchId')));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

app.openapi(
  createRoute({
    method: 'delete',
    path: '/llm-batch/batches/{batchId}',
    tags: ['LLM Batch'],
    summary: 'Delete batch',
    request: {
      params: z.object({ batchId: z.string() })
    },
    responses: { 200: { description: 'Deleted batch' } }
  }),
  async c => {
    try {
      return c.json(await deleteBatch(c.req.param('batchId')));
    } catch (error: any) {
      console.error(error.stack);
      return c.text(errorBody(error), errorStatus(error));
    }
  }
);

/* ── RPT ────────────────────────────────────────────────────────────────── */

app.openapi(
  createRoute({
    method: 'get',
    path: '/rpt/predict',
    tags: ['RPT'],
    summary: 'Predict with schema',
    responses: { 200: { description: 'Prediction result' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const data = await predictWithSchema();
        await s.write(
          `Prediction: ${JSON.stringify(data.predictions, null, 2)}\n`
        );
      } catch (error: any) {
        console.error(error.stack);
        await s.write(`Error: ${errorBody(error)}\n`);
      }
    })
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/rpt/predict-automatic',
    tags: ['RPT'],
    summary: 'Predict with automatic parsing',
    responses: { 200: { description: 'Prediction result' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const data = await predictAutomaticParsing();
        await s.write(
          `Prediction: ${JSON.stringify(data.predictions, null, 2)}\n`
        );
      } catch (error: any) {
        console.error(error.stack);
        await s.write(`Error: ${errorBody(error)}\n`);
      }
    })
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/rpt/predict-parquet',
    tags: ['RPT'],
    summary: 'Predict with parquet blob',
    responses: { 200: { description: 'Prediction result' } }
  }),
  async c =>
    stream(c, async s => {
      try {
        const data = await predictParquetBlob();
        await s.write(
          `Prediction: ${JSON.stringify(data.predictions, null, 2)}\n`
        );
      } catch (error: any) {
        console.error(error.stack);
        await s.write(`Error: ${errorBody(error)}\n`);
      }
    })
);

/* ── OpenAPI docs ───────────────────────────────────────────────────────── */

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'SAP AI SDK Sample Server',
    version: '1.0.0',
    description:
      'Sample endpoints demonstrating SAP AI SDK capabilities: foundation models, orchestration, LangChain, document grounding, prompt registry, LLM batch, and RPT.'
  }
});

app.get('/docs', swaggerUI({ url: '/openapi.json' }));

/* ── server ─────────────────────────────────────────────────────────────── */

const server = serve(
  { fetch: (req, env) => app.fetch(req, env), port },
  info => {
    console.log(`Server running at http://localhost:${info.port}`);
  }
);

server.on('error', (error: Error) => {
  console.error(`Failed to start server on port ${port}`, error);
  process.exit(1);
});
