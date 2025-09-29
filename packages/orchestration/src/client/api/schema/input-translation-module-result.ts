/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Input Translation module result
 */
export type InputTranslationModuleResult = {
  /**
   * Status message describing the translation operation outcome.
   * @example "Translated successfully placeholders 'issue_title', 'issue_description'."
   */
  message: string;
  data?: {
    /**
     * @deprecated
     * @example "[{'role': 'user', 'content': 'translated content'}, ...]"
     */
    translated_template?: string;
    /**
     * @example {
     *   "user": [
     *     "translated user content",
     *     "another translated user content"
     *   ],
     *   "system": [
     *     "translated system message"
     *   ]
     * }
     */
    translated_template_roles?: Record<string, string[]>;
    /**
     * @example {
     *   "groundingInput": "translated grounding input",
     *   "inputContext": "translated input context"
     * }
     */
    translated_placeholders?: Record<string, string>;
  };
};
