/* eslint-disable no-console */
import express from 'express';
import {
  chatCompletion,
  chatCompletionStream as azureChatCompletionStream,
  chatCompletionWithDestination,
  computeEmbedding,
  chatCompletionWithFunctionCall
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
  orchestrationGroundingVector,
  orchestrationChatCompletionImage,
  chatCompletionStreamWithJsonModuleConfig as orchestrationChatCompletionStreamWithJsonModuleConfig,
  orchestrationGroundingHelpSapCom,
  orchestrationMaskGroundingInput,
  orchestrationPromptRegistry,
  orchestrationMessageHistory,
  orchestrationResponseFormat
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
  invoke,
  invokeToolChain
} from './langchain-azure-openai.js';
import {
  invokeChain as invokeChainOrchestration,
  invokeChainWithInputFilter as invokeChainWithInputFilterOrchestration,
  invokeChainWithOutputFilter as invokeChainWithOutputFilterOrchestration,
  invokeLangGraphChain,
  invokeChainWithMasking
} from './langchain-orchestration.js';
import {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  retrieveDocuments
} from './document-grounding.js';
import {
  createPromptTemplate,
  deletePromptTemplate
} from './prompt-registry.js';
import type { RetievalPerFilterSearchResult } from '@sap-ai-sdk/document-grounding';
import type { AiDeploymentStatus } from '@sap-ai-sdk/ai-api';
import type { OrchestrationResponse } from '@sap-ai-sdk/orchestration';

const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get(['/', '/health'], (req, res) => {
  res.send('Hello World! 🌍');
});

function sendError(res: any, error: any, send: boolean = true) {
  console.error(error.stack);
  if (send) {
    res
      .status(error.cause?.status ?? 500)
      .send(error.cause?.response?.data ?? error.message);
  }
}

/* AI API */
app.get('/ai-api/deployments', async (req, res) => {
  try {
    res.send(
      await getDeployments('default', req.query.status as AiDeploymentStatus)
    );
  } catch (error: any) {
    sendError(res, error);
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
    sendError(res, error);
  }
});

app.post('/ai-api/deployment/create', express.json(), async (req, res) => {
  try {
    res.send(await createDeployment(req.body.configurationId, 'default'));
  } catch (error: any) {
    sendError(res, error);
  }
});

app.patch('/ai-api/deployment/batch-stop', express.json(), async (req, res) => {
  try {
    res.send(await stopDeployments(req.body.configurationId, 'default'));
  } catch (error: any) {
    sendError(res, error);
  }
});

app.delete(
  '/ai-api/deployment/batch-delete',
  express.json(),
  async (req, res) => {
    try {
      res.send(await deleteDeployments('default'));
    } catch (error: any) {
      sendError(res, error);
    }
  }
);

app.get('/ai-api/scenarios', async (req, res) => {
  try {
    res.send(await getScenarios('default'));
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get('/ai-api/models', async (req, res) => {
  try {
    res.send(await getModelsInScenario('foundation-models', 'default'));
  } catch (error: any) {
    sendError(res, error);
  }
});

/* Foundation Models (Azure OpenAI) */
app.get('/azure-openai/chat-completion', async (req, res) => {
  try {
    const response = await chatCompletion();
    res.header('Content-Type', 'text/plain').send(response.getContent());
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get('/azure-openai/chat-completion-with-destination', async (req, res) => {
  try {
    const response = await chatCompletionWithDestination();
    res.header('Content-Type', 'text/plain').send(response.getContent());
  } catch (error: any) {
    sendError(res, error);
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
    sendError(res, error, false);
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
    sendError(res, error);
  }
});

app.get('/azure-openai/invoke-tool-chain', async (req, res) => {
  try {
    const response = await chatCompletionWithFunctionCall();
    res.header('Content-Type', 'text/plain').send(response.getContent());
  } catch (error: any) {
    sendError(res, error);
  }
});

/* Orchestration */
app.get('/orchestration/:sampleCase', async (req, res) => {
  const sampleCase = req.params.sampleCase;
  const testCase =
    {
      simple: orchestrationChatCompletion,
      template: orchestrationTemplating,
      templateRef: orchestrationPromptRegistry,
      messageHistory: orchestrationMessageHistory,
      inputFiltering: orchestrationInputFiltering,
      outputFiltering: orchestrationOutputFiltering,
      requestConfig: orchestrationRequestConfig,
      fromJson: orchestrationFromJson,
      image: orchestrationChatCompletionImage,
      responseFormat: orchestrationResponseFormat,
      maskGroundingInput: orchestrationMaskGroundingInput
    }[sampleCase] || orchestrationChatCompletion;

  try {
    const result = (await testCase()) as OrchestrationResponse;
    if (sampleCase === 'inputFiltering') {
      res
        .header('Content-Type', 'text/plain')
        .send(
          `Input filter applied successfully with response:\n${JSON.stringify(result, null, 2)}`
        );
    } else if (sampleCase === 'outputFiltering') {
      res
        .header('Content-Type', 'text/plain')
        .send(
          `Output filter applied successfully with threshold results:\n${JSON.stringify(result.data.module_results.output_filtering!.data!, null, 2)}`
        );
    } else if (sampleCase === 'responseFormat') {
      res
        .header('Content-Type', 'text/plain')
        .send(
          `Response format applied successfully with response:\n${JSON.stringify(result, null, 2)}`
        );
    } else {
      console.log(JSON.stringify(result.data, null, 2));
      res.header('Content-Type', 'text/plain').send(result.getContent());
    }
  } catch (error: any) {
    sendError(res, error);
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
      sendError(res, error, false);
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
      sendError(res, error, false);
    } finally {
      res.end();
    }
  }
);

/* Langchain */
app.get('/langchain/invoke', async (req, res) => {
  try {
    res.header('Content-Type', 'text/plain').send(await invoke());
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get('/langchain/invoke-chain', async (req, res) => {
  try {
    res.header('Content-Type', 'text/plain').send(await invokeChain());
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get('/langchain/invoke-chain-orchestration', async (req, res) => {
  try {
    res.send(await invokeChainOrchestration());
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get(
  '/langchain/invoke-chain-orchestration-input-filter',
  async (req, res) => {
    try {
      res.send(await invokeChainWithInputFilterOrchestration());
    } catch (error: any) {
      sendError(res, error);
    }
  }
);

app.get(
  '/langchain/invoke-chain-orchestration-output-filter',
  async (req, res) => {
    try {
      res.send(await invokeChainWithOutputFilterOrchestration());
    } catch (error: any) {
      sendError(res, error);
    }
  }
);

app.get('/langchain/invoke-chain-orchestration-masking', async (req, res) => {
  try {
    res.send(await invokeChainWithMasking());
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get('/langchain/invoke-rag-chain', async (req, res) => {
  try {
    res.header('Content-Type', 'text/plain').send(await invokeRagChain());
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get('/langchain/invoke-tool-chain', async (req, res) => {
  try {
    res.header('Content-Type', 'text/plain').send(await invokeToolChain());
  } catch (error: any) {
    sendError(res, error);
  }
});

app.get('/langchain/invoke-stateful-chain', async (req, res) => {
  try {
    res.header('Content-Type', 'text/plain').send(await invokeLangGraphChain());
  } catch (error: any) {
    sendError(res, error);
  }
});

/* Document Grounding */
app.get(
  '/document-grounding/orchestration-grounding-vector',
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
      const groundingResult = await orchestrationGroundingVector();
      res.write(
        `Orchestration responded with timestamp:\t${groundingResult.getContent()}\n`
      );

      // Print the grounding data.
      const groundingResultString =
        groundingResult.data.module_results.grounding?.data?.grounding_result;
      res.write(
        `Orchestration grounding metadata:\t${JSON.stringify(JSON.parse(groundingResultString)[0].metadata)}\n`
      );

      // Delete the created collection.
      await deleteCollection(collectionId);
      res.write(`Collection deleted:\t\t\t${collectionId}\n`);

      res.end();
    } catch (error: any) {
      sendError(res, error);
    }
  }
);

app.get('/document-grounding/retrieve-documents', async (req, res) => {
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
    sendError(res, error);
  }
});

app.get(
  '/document-grounding/orchestration-grounding-help-sap-com',
  async (req, res) => {
    try {
      const groundingResult = await orchestrationGroundingHelpSapCom();
      res
        .header('Content-Type', 'text/plain')
        .send(groundingResult.getContent());
    } catch (error: any) {
      sendError(res, error);
    }
  }
);

app.get('/prompt-registry/template', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const { id } = await createPromptTemplate(
      'ai-sdk-js-sample',
      'orchestration'
    );
    res.write(`Prompt template created: ${id}\n`);

    const response = await deletePromptTemplate(id);
    res.write(`Prompt template deleted: ${response.message}\n`);

    res.end();
  } catch (error: any) {
    sendError(res, error);
  }
});
