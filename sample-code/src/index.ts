import express from 'express';
import 'dotenv/config.js';
import { chatCompletion, computeEmbedding } from './aiservice.js';
import { clearXsuaaServices } from '@sap-cloud-sdk/connectivity/internal.js';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello World! 🌍');
});

app.get('/llm', (req, res) => {
  chatCompletion()
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Yikes, vibes are off apparently 😬 -> ' + error.message);
    })
});

app.get('/embedding', (req, res) => {
  computeEmbedding()
    .then(_ => {
      res.send("Number crunching success, got a nice vector.");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Yikes, vibes are off apparently 😬 -> ' + error.message);
    })
});

app.get('/orchestration', (req, res) => {
  res.status(418).send('Not implemented 🛠️');
});

app.get('/cleanup', (req, res) => {
  clearXsuaaServices();
  res.send('Cleanup Finished');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});