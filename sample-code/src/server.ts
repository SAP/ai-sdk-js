/* eslint-disable no-console */
import express from 'express';
import { AiApiError } from '@sap-ai-sdk/ai-api';
import { OrchestrationResponse } from '@sap-ai-sdk/orchestration';
import {
  chatCompletion,
  computeEmbedding
} from './foundation-models/azure-openai.js';
import {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig
} from './orchestration.js';
import { getDeployments, createDeployment } from './ai-api/deployment-api.js';
import { getModelsInScenario } from './ai-api/scenario-api.js';
import {
  invokeChain,
  invokeRagChain,
  invoke
} from './langchain-azure-openai.js';

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

app.get('/ai-api/get-deployments', async (req, res) => {
  try {
    res.send(await getDeployments('default'));
  } catch (error: any) {
    console.error(error);
    const apiError = error.response.data.error as AiApiError;
    res
      .status(error.response.status)
      .send('Yikes, vibes are off apparently 😬 -> ' + apiError.message);
  }
});

app.post('/ai-api/create-deployment', async (req, res) => {
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

app.get('/ai-api/get-models-in-scenario', async (req, res) => {
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

app.get('/langchain/chat', async (req, res) => {
  try {
    res.send(await invoke());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/complex-chat', async (req, res) => {
  try {
    res.send(await invokeChain());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/retrieval-augmented-generation', async (req, res) => {
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
