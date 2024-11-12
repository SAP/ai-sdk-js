/* eslint-disable no-console */
import express from 'express';
import {
  chatCompletion,
  chatCompletionStream,
  chatCompletionStreamMultipleChoices,
  computeEmbedding
  // eslint-disable-next-line import/no-internal-modules
} from './foundation-models/azure-openai.js';
import {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig
} from './orchestration.js';
import {
  getDeployments,
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
import type { AiApiError, AiDeploymentStatus } from '@sap-ai-sdk/ai-api';
import type { OrchestrationResponse } from '@sap-ai-sdk/orchestration';

const app = express();
const port = 8080;

app.get(['/', '/health'], (req, res) => {
  res.send('Hello World! 🌍');
});

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

app.get('/azure-openai/chat-completion-stream', async (req, res) => {
  const controller = new AbortController();
  try {
    const response = await chatCompletionStream(controller);

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let connectionAlive = true;

    res.on('close', () => {
      controller.abort();
      connectionAlive = false;
      res.end();
    });

    for await (const chunk of response.getStream().toContentStream()) {
      if (!connectionAlive) {
        break;
      }
      res.write(chunk);
    }

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

app.get(
  '/azure-openai/chat-completion-stream-multiple-choices',
  async (req, res) => {
    const controller = new AbortController();
    try {
      const response = await chatCompletionStreamMultipleChoices(controller);

      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      let connectionAlive = true;

      res.on('close', () => {
        controller.abort();
        connectionAlive = false;
        res.end();
      });

      for await (const chunk of response.getStream().toContentStream(1)) {
        if (!connectionAlive) {
          break;
        }
        res.write(chunk);
      }

      if (connectionAlive) {
        const finishReason = response.getFinishReason(1);
        const tokenUsage = response.getTokenUsage()!;
        res.write('\n\n---------------------------\n');
        res.write(`Finish reason: ${finishReason}\n`);
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
  }
);

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

app.get('/orchestration/:sampleCase', async (req, res) => {
  const sampleCase = req.params.sampleCase;
  const testCase =
    {
      simple: orchestrationChatCompletion,
      template: orchestrationTemplating,
      inputFiltering: orchestrationInputFiltering,
      outputFiltering: orchestrationOutputFiltering,
      requestConfig: orchestrationRequestConfig,
      default: orchestrationChatCompletion
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
      res.send(result.getContent());
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
