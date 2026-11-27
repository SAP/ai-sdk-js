import { RptDecisionsClient } from '@sap-ai-sdk/rpt/decisions';

import { expectAssignable, expectError, expectType } from 'tsd';

import type { SapRptDecisionsModel } from '@sap-ai-sdk/core';
import type {
  SystemOneExample,
  SystemOneQuestion,
  SystemOneRequest,
  SystemOneResponse
} from '@sap-ai-sdk/rpt/decisions';

expectAssignable<SapRptDecisionsModel>('sap-rpt-decisions');

const example: SystemOneExample = {
  state: 'const value = 1;',
  answers: { language: 'JavaScript' }
};

const question: SystemOneQuestion = {
  type: 'choice',
  instructions: 'Which programming language is this?',
  criteria: { Java: 'Java code.', JavaScript: 'JavaScript code.' }
};

const request: SystemOneRequest = {
  state: 'let value = 2;',
  questions: { language: question },
  examples: [example, example]
};

expectType<Promise<SystemOneResponse>>(
  new RptDecisionsClient('sap-rpt-decisions').systemone(request)
);
expectType<Promise<SystemOneResponse>>(
  new RptDecisionsClient({
    deploymentId: 'decisions',
    resourceGroup: 'custom'
  }).systemone(request, { headers: { 'x-request-id': 'test' } })
);

expectError(
  new RptDecisionsClient('sap-rpt-decisions').systemone({
    ...request,
    examples: []
  })
);
expectError(
  new RptDecisionsClient('sap-rpt-decisions').systemone({
    ...request,
    examples: [example]
  })
);
expectError(
  new RptDecisionsClient('sap-rpt-decisions').systemone({
    ...request,
    questions: {
      language: { type: 'choice', instructions: 'Missing criteria.' }
    }
  })
);
expectError(
  new RptDecisionsClient('sap-rpt-decisions').systemone({
    ...request,
    questions: { language: { type: 'invalid', instructions: 'Unknown type.' } }
  })
);
