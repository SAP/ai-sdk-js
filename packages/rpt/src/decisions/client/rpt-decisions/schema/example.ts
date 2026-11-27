/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * One labeled few-shot example.
 *
 * ``state`` is shaped exactly like the request's ``state``; ``answers`` holds the known answer for
 * each question, keyed by question key.
 */
export type Example = {
  /**
   * The example content, shaped like the request state.
   */
  state: string | Record<string, any> | any[];
  /**
   * The known answers for this example, keyed by question name/key — one entry per question the request asks. Each value is the bare known answer (e.g. an option value, "true"/"false", or a level index).
   */
  answers: Record<string, string | number | number | boolean>;
};
