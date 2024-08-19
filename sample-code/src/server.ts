/* eslint-disable no-console */
import express from 'express';
import {
  chatCompletion,
  computeEmbedding, orchestrationChatCompletionContentFilter,
  orchestrationChatCompletionMin, orchestrationChatCompletionTemplate, orchestrationChatCompletionTemplateComplex
} from './aiservice.js';
import 'dotenv/config.js';

console.log(process.env.AICORE_SERVICE_KEY);

const app = express();
const port = 8080;

app.get(['/', '/health'], (req, res) => {
  res.send('Hello World! 🌍');
});

app.get('/orchestration', async (req, res) => {
  try {
    // res.send(await orchestrationChatCompletionMin());
    // res.send((await orchestrationChatCompletionTemplate()).replaceAll('\n', '<br/>'));
    // res.send((await orchestrationChatCompletionTemplateComplex()).replaceAll('\n', '<br/>'));
    res.send(await orchestrationChatCompletionContentFilter());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
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
    res.send(`Number crunching success, got a nice vector: ${result[0]}...`);
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
