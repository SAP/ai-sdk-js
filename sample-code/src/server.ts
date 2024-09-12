/* eslint-disable no-console */
import express from 'express';
import {
  chatCompletion,
  computeEmbedding
} from './foundation-models-openai.js';
import { orchestrationCompletion } from './orchestration.js';
import { getDeployments } from './ai-api.js';
import { embedQuery, generate } from './langchain-openai.js';

const app = express();
const port = 8080;

app.get(['/', '/health'], (req, res) => {
  res.send('Hello World! 🌍');
});

app.get('/llm', async (req, res) => {
  try {
    res.send(await chatCompletion());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/embedding', async (req, res) => {
  try {
    const result = await computeEmbedding();
    if (result.length === 0) {
      throw new Error('No embedding vector returned');
    }
    res.send('Number crunching success, got a nice vector.');
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/orchestration', async (req, res) => {
  try {
    res.send(await orchestrationCompletion());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/ai-api/get-deployments', async (req, res) => {
  try {
    res.send(await getDeployments());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/chat', async (req, res) => {
  try {
    res.send(await generate());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/embedding', async (req, res) => {
  try {
    const result = await embedQuery();
    if (result.length === 0) {
      throw new Error('No embedding vector returned');
    }
    res.send('Number crunching success, got a nice vector.');
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
