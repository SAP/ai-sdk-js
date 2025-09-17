/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * This selector allows you to define the scope of translation, such as specific placeholders or messages with specific roles. For example, `{"category": "placeholders", "items": ["user_input"], "source_language": "de-DE"}` targets the value of "user_input" in `placeholder_values` specified in the request payload; and considers the value to be in German.
 *
 */
export type SAPDocumentTranslationApplyToSelector = {
  /**
   * Category to apply translation to.
   */
  category: 'placeholders' | 'template_roles';
  /**
   * List of placeholders or roles to apply translation to
   * @example [
   *   "groundingInput",
   *   "inputContext"
   * ]
   */
  items: string[];
  /**
   * Language of the text to be translated.
   * @example "de-DE"
   */
  source_language?: string;
};
