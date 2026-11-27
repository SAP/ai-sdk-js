/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ChoiceAnswer } from './choice-answer.js';
import type { NoulAnswer } from './noul-answer.js';
import type { PredictResponseMetadata } from './predict-response-metadata.js';
import type { ScoreAnswer } from './score-answer.js';
import type { Usage } from './usage.js';
/**
 * Response body for ``POST /systemone``.
 */
export type Response = {
  /**
   * The model that served the request.
   */
  model?: string | null;
  /**
   * Answers keyed by question key.
   */
  answers: Record<
    string,
    | ({ type: 'choice' } & ChoiceAnswer)
    | ({ type: 'noul' } & NoulAnswer)
    | ({ type: 'score' } & ScoreAnswer)
  >;
  usage?: Usage;
  /**
   * Metadata about the request.
   */
  metadata: PredictResponseMetadata;
};
