/* eslint-disable no-console */
import express from 'express';
import { AiApiError } from '@sap-ai-sdk/ai-api';
import {
  chatCompletion,
  computeEmbedding
} from './foundation-models/azure-openai.js';
import { orchestrationCompletion } from './orchestration.js';
import { createDeployment, getDeployments } from './ai-api/deployment-api.js';
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
  try {
    res.send(await orchestrationCompletion(req.params.sampleCase));
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
