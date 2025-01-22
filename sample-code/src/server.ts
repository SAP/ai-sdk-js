/* eslint-disable no-console */
import express from 'express';
import {
  chatCompletion,
  chatCompletionStream as azureChatCompletionStream,
  chatCompletionWithDestination,
  computeEmbedding
  // eslint-disable-next-line import/no-internal-modules
} from './foundation-models/azure-openai.js';
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
  chatCompletionStreamWithJsonModuleConfig as orchestrationChatCompletionStreamWithJsonModuleConfig
} from './orchestration.js';
import {
  getDeployments,
  getDeploymentsWithDestination,
  createDeployment,
  stopDeployments,
  deleteDeployments
  // eslint-disable-next-line import/no-internal-modules
} from './ai-api/deployment-api.js';
import {
  getScenarios,
  getModelsInScenario
  // eslint-disable-next-line import/no-internal-modules
} from './ai-api/scenario-api.js';
import {
  invokeChain,
  invokeRagChain,
  invoke
} from './langchain-azure-openai.js';
import {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  retrieveDocuments
} from './document-grounding.js';
import type { RetievalPerFilterSearchResult } from '@sap-ai-sdk/document-grounding';
import type { AiApiError, AiDeploymentStatus } from '@sap-ai-sdk/ai-api';
import type { OrchestrationResponse } from '@sap-ai-sdk/orchestration';

const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get(['/', '/health'], (req, res) => {
  res.send('Hello World! 🌍');
});

/* AI API */
app.get('/ai-api/deployments', async (req, res) => {
  try {
    res.send(
      await getDeployments('default', req.query.status as AiDeploymentStatus)
    );
  } catch (error: any) {
    console.error(error);
    const apiError = error.response.data.error as AiApiError;
    res
      .status(error.response.status)
      .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
  }
});

app.get('/ai-api/deployments-with-destination', async (req, res) => {
  try {
    res.send(
      await getDeploymentsWithDestination(
        'default',
        req.query.status as AiDeploymentStatus
      )
    );
  } catch (error: any) {
    console.error(error);
    const apiError = error.response.data.error as AiApiError;
    res
      .status(error.response.status)
      .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
  }
});

app.post('/ai-api/deployment/create', express.json(), async (req, res) => {
  try {
    res.send(await createDeployment(req.body.configurationId, 'default'));
  } catch (error: any) {
    console.error(error);
    const apiError = error.response.data.error as AiApiError;
    res
      .status(error.response.status)
      .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
  }
});

app.patch('/ai-api/deployment/batch-stop', express.json(), async (req, res) => {
  try {
    res.send(await stopDeployments(req.body.configurationId, 'default'));
  } catch (error: any) {
    console.error(error);
    const apiError = error.response.data.error as AiApiError;
    res
      .status(error.response.status)
      .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
  }
});

app.delete(
  '/ai-api/deployment/batch-delete',
  express.json(),
  async (req, res) => {
    try {
      res.send(await deleteDeployments('default'));
    } catch (error: any) {
      console.error(error);
      const apiError = error.response.data.error as AiApiError;
      res
        .status(error.response.status)
        .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
    }
  }
);

app.get('/ai-api/scenarios', async (req, res) => {
  try {
    res.send(await getScenarios('default'));
  } catch (error: any) {
    console.error(error);
    const apiError = error.response.data.error as AiApiError;
    res
      .status(error.response.status)
      .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
  }
});

app.get('/ai-api/models', async (req, res) => {
  try {
    res.send(await getModelsInScenario('foundation-models', 'default'));
  } catch (error: any) {
    console.error(error);
    const apiError = error.response.data.error as AiApiError;
    res
      .status(error.response.status)
      .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
  }
});

/* Foundation Models (Azure OpenAI) */
app.get('/azure-openai/chat-completion', async (req, res) => {
  try {
    const response = await chatCompletion();
    res.send(response.getContent());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/azure-openai/chat-completion-with-destination', async (req, res) => {
  try {
    const response = await chatCompletionWithDestination();
    res.send(response.getContent());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/azure-openai/chat-completion-stream', async (req, res) => {
  const controller = new AbortController();
  try {
    const response = await azureChatCompletionStream(controller);

    // Set headers for event stream.
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let connectionAlive = true;

    // Abort the stream if the client connection is closed.
    res.on('close', () => {
      controller.abort();
      connectionAlive = false;
      res.end();
    });

    // Stream the delta content.
    for await (const chunk of response.stream.toContentStream()) {
      if (!connectionAlive) {
        break;
      }
      res.write(chunk);
    }

    // Write the finish reason and token usage after the stream ends.
    if (connectionAlive) {
      const finishReason = response.getFinishReason();
      const tokenUsage = response.getTokenUsage()!;
      res.write('\n\n---------------------------\n');
      res.write(`Finish reason: ${finishReason}\n`);
      res.write('Token usage:\n');
      res.write(`  - Completion tokens: ${tokenUsage.completion_tokens}\n`);
      res.write(`  - Prompt tokens: ${tokenUsage.prompt_tokens}\n`);
      res.write(`  - Total tokens: ${tokenUsage.total_tokens}\n`);
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  } finally {
    res.end();
  }
});

app.get('/azure-openai/embedding', async (req, res) => {
  try {
    const response = await computeEmbedding();

    if (!response.getEmbedding()?.length) {
      res.status(500).send('No embedding vector returned.');
    } else {
      res.send('Number crunching success, got a nice vector.');
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

/* Orchestration */
app.get('/orchestration/:sampleCase', async (req, res) => {
  const sampleCase = req.params.sampleCase;
  const testCase =
    {
      simple: orchestrationChatCompletion,
      template: orchestrationTemplating,
      inputFiltering: orchestrationInputFiltering,
      outputFiltering: orchestrationOutputFiltering,
      requestConfig: orchestrationRequestConfig,
      fromJson: orchestrationFromJson,
      image: orchestrationChatCompletionImage
    }[sampleCase] || orchestrationChatCompletion;

  try {
    const result = (await testCase()) as OrchestrationResponse;
    if (sampleCase === 'inputFiltering') {
      res.send('Input filter applied successfully');
    } else if (sampleCase === 'outputFiltering') {
      res.send(
        `Output filter applied successfully with threshold results: ${JSON.stringify(result.data.module_results.output_filtering!.data!)}`
      );
    } else {
      res.send(result);
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.post(
  '/orchestration-stream/chat-completion-stream',
  express.json(),
  async (req, res) => {
    const controller = new AbortController();
    try {
      const response = await orchestrationChatCompletionStream(
        controller,
        req.body
      );

      // Set headers for event stream.
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      let connectionAlive = true;

      // Abort the stream if the client connection is closed.
      res.on('close', () => {
        controller.abort();
        connectionAlive = false;
        res.end();
      });

      // Stream the delta content.
      for await (const chunk of response.stream) {
        if (!connectionAlive) {
          break;
        }
        res.write(chunk.getDeltaContent() + '\n');
      }

      // Write the finish reason and token usage after the stream ends.
      if (connectionAlive) {
        const finishReason = response.getFinishReason();
        const tokenUsage = response.getTokenUsage();
        res.write('\n\n---------------------------\n');
        res.write(`Finish reason: ${finishReason}\n`);
        res.write('Token usage:\n');
        res.write(`  - Completion tokens: ${tokenUsage?.completion_tokens}\n`);
        res.write(`  - Prompt tokens: ${tokenUsage?.prompt_tokens}\n`);
        res.write(`  - Total tokens: ${tokenUsage?.total_tokens}\n`);
      }
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
    } finally {
      res.end();
    }
  }
);

app.get(
  '/orchestration-stream/chat-completion-stream-json',
  async (req, res) => {
    const controller = new AbortController();
    try {
      const response =
        await orchestrationChatCompletionStreamWithJsonModuleConfig(controller);

      // Set headers for event stream.
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      let connectionAlive = true;

      // Abort the stream if the client connection is closed.
      res.on('close', () => {
        controller.abort();
        connectionAlive = false;
        res.end();
      });

      // Stream the delta content.
      for await (const chunk of response.stream) {
        if (!connectionAlive) {
          break;
        }
        res.write(chunk.getDeltaContent() + '\n');
      }

      // Write the finish reason and token usage after the stream ends.
      if (connectionAlive) {
        const finishReason = response.getFinishReason();
        const tokenUsage = response.getTokenUsage();
        res.write('\n\n---------------------------\n');
        res.write(`Finish reason: ${finishReason}\n`);
        res.write('Token usage:\n');
        res.write(`  - Completion tokens: ${tokenUsage?.completion_tokens}\n`);
        res.write(`  - Prompt tokens: ${tokenUsage?.prompt_tokens}\n`);
        res.write(`  - Total tokens: ${tokenUsage?.total_tokens}\n`);
      }
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
    } finally {
      res.end();
    }
  }
);

/* Langchain */
app.get('/langchain/invoke', async (req, res) => {
  try {
    res.send(await invoke());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/invoke-chain', async (req, res) => {
  try {
    res.send(await invokeChain());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/invoke-rag-chain', async (req, res) => {
  try {
    res.send(await invokeRagChain());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

/* Document Grounding */
app.get(
  '/document-grounding/invoke-orchestration-grounding',
  async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // Create an empty collection.
      const collectionId = await createCollection();
      res.write(`Collection created:\t\t\t${collectionId}\n`);

      // Create a document with the current timestamp.
      const timestamp = Date.now();
      await createDocumentsWithTimestamp(collectionId, timestamp);
      res.write(`Document created with timestamp:\t${timestamp}\n`);

      // Send an orchestration chat completion request with grounding module configured.
      const groundingResult = await orchestrationGrounding();
      res.write(
        `Orchestration responded with timestamp:\t${groundingResult.getContent()}\n`
      );

      // Delete the created collection.
      await deleteCollection(collectionId);
      res.write(`Collection deleted:\t\t\t${collectionId}\n`);

      res.end();
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
    }
  }
);

app.get('/document-grounding/invoke-retrieve-documents', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Create an empty collection.
    const collectionId = await createCollection();
    res.write(`Collection created:\t\t\t${collectionId}\n`);

    // Create a document with the current timestamp.
    const timestamp = Date.now();
    await createDocumentsWithTimestamp(collectionId, timestamp);
    res.write(`Document created with timestamp:\t${timestamp}\n`);

    // Retrieve documents directly from document grounding service.
    const retrievalResult = await retrieveDocuments();

    console.log(JSON.stringify(retrievalResult));

    res.write('Retrieved documents:\n');
    (retrievalResult.results as RetievalPerFilterSearchResult[]).forEach(
      perFilterSearchResult => {
        res.write(`  - Filter: ${perFilterSearchResult.filterId}\n`);
        perFilterSearchResult.results!.forEach(
          retievalDataRepositorySearchResult => {
            res.write(
              `    - Data repository: ${retievalDataRepositorySearchResult.dataRepository.title}\n`
            );
            retievalDataRepositorySearchResult.dataRepository.documents.forEach(
              retrievalDocument => {
                retrievalDocument.chunks.forEach(chunk => {
                  res.write(`      - Chunk: ${chunk.content}\n`);
                });
              }
            );
          }
        );
      }
    );

    // Delete the created collection.
    await deleteCollection(collectionId);
    res.write(`Collection deleted:\t\t\t${collectionId}\n`);

    res.end();
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});
