/* eslint-disable no-console */
import express from 'express';
import { OrchestrationResponse } from '@sap-ai-sdk/orchestration';
import {
  chatCompletion,
  computeEmbedding
} from './foundation-models-azure-openai.js';
import {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig
} from './orchestration.js';
import { getDeployments } from './ai-api.js';
import {
  complexInvoke,
  embedDocument,
  embedQuery,
  simpleInvoke
} from './langchain-azure-openai.js';

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
    if (!result.length) {
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
  const func =
    sampleCase === 'simple'
      ? orchestrationChatCompletion
      : sampleCase === 'template'
        ? orchestrationTemplating
        : sampleCase === 'inputFiltering'
          ? orchestrationInputFiltering
          : sampleCase === 'outpttFiltering'
            ? orchestrationOutputFiltering
            : sampleCase === 'requestConfig'
              ? orchestrationRequestConfig
              : orchestrationChatCompletion;

  try {
    const result = (await func()) as OrchestrationResponse;
    if (sampleCase === 'inputFiltering') {
      res.send('Input filter applied successfully');
    } else if (sampleCase === 'outputFiltering') {
      res.send(
        `Output filter applied successfully with threshold results: ${result.data.module_results.output_filtering!.data!}`
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
    res.send(await simpleInvoke());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/complex-chat', async (req, res) => {
  try {
    res.send(await complexInvoke());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
  }
});

app.get('/langchain/embed-query', async (req, res) => {
  try {
    const result = await embedQuery();
    if (!result.length) {
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

app.get('/langchain/embed-document', async (req, res) => {
  try {
    const result = await embedDocument();
    if (!result.length) {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
