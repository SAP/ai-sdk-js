/* eslint-disable no-console */
import express from 'express';
import { aiCore, orchestration } from './main.js';

const app = express();
const port = 8080;

app.get(['/', '/health'], (req, res) => {
  res.send('Hello World! 🌍');
});

app.get('/aicore', async (req, res) => {
  try {
    res.send(await aiCore());
  } catch (error: any) {
    console.error(error);
    res.status(500).send('AI Core request failed.' + error.message);
  }
});

app.get('/orchestration', async (req, res) => {
  try {
    res.send(await orchestration());
  } catch (error: any) {
    console.error(error);
    res.status(500).send('AI Core request failed.' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
