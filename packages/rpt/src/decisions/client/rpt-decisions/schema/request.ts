/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ChoiceQuestion } from './choice-question.js';
import type { Example } from './example.js';
import type { NoulQuestion } from './noul-question.js';
import type { ScoreQuestion } from './score-question.js';
/**
 * Request body for ``POST /systemone``.
 */
export type Request = {
  /**
   * The content to evaluate. A plain string, or structured data (object/array).
   */
  state: string | Record<string, any> | any[];
  /**
   * Optional model name. Accepted but ignored; the response always reports the model that served the request.
   */
  model?: string | null;
  /**
   * A map of question key to typed question.
   */
  questions: Record<
    string,
    | ({ type: 'choice' } & ChoiceQuestion)
    | ({ type: 'noul' } & NoulQuestion)
    | ({ type: 'score' } & ScoreQuestion)
  >;
  /**
   * Labeled few-shot examples to learn from (required). At least two examples must be provided; more and better-matched examples improve the answer. The upper bound (2048) is the limit for this model.
   * Min Items: 2.
   * Max Items: 2048.
   */
  examples: Example[];
};
