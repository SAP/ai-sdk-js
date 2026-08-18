/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Configuration for IBM Granite Guardian 4.1 filter provider.
 */
export type GraniteGuardian41 = {
  /**
   * Enable reasoning (think) mode for Granite Guardian. Applies to every configured category. Returns reasoning content when enabled.
   */
  enable_think_mode?: boolean;
  /**
   * Content criteria to evaluate. Note: Granite Guardian requires separate calls for each configured content category. Recommendation: Use only `harm` catch all content category.
   */
  categories: {
    /**
     * Catch-all criterion for generally harmful content.
     */
    harm?: boolean;
    /**
     * Detect prejudice or discrimination based on identity or protected characteristics.
     */
    social_bias?: boolean;
    /**
     * Detect attempts to manipulate the model into producing harmful or otherwise undesired outputs.
     */
    jailbreak?: boolean;
    /**
     * Detect content promoting or depicting physical, mental, or sexual harm.
     */
    violence?: boolean;
    /**
     * Detect offensive language or insults.
     */
    profanity?: boolean;
    /**
     * Detect explicit or suggestive material of a sexual nature.
     */
    sexual_content?: boolean;
    /**
     * Detect content describing actions that violate moral or legal standards.
     */
    unethical_behavior?: boolean;
  };
};
