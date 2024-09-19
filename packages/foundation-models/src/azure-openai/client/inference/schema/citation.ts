/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Citation information for a chat completions response message.
 */
export type AzureOpenAiCitation = {
  /**
   * The content of the citation.
   */
  content: string;
  /**
   * The title of the citation.
   */
  title?: string;
  /**
   * The URL of the citation.
   */
  url?: string;
  /**
   * The file path of the citation.
   */
  filepath?: string;
  /**
   * The chunk ID of the citation.
   */
  chunk_id?: string;
} & Record<string, any>;
