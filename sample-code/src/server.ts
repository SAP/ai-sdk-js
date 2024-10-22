/* eslint-disable no-console */
import express from 'express';
import {
  chatCompletion,
  chatCompletionStream,
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
import { getDeployments } from './ai-api.js';
import {
  invokeChain,
  invokeRagChain,
  invoke
} from './langchain-azure-openai.js';
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

app.get('/azure-openai/chat-completion-stream', async (req, res)=> {
  try {
    await chatCompletionStream();
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
    res.send(await getDeployments());
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send('Yikes, vibes are off apparently 😬 -> ' + error.message);
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
