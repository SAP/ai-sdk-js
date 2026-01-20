/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MergeStrategyType } from './merge-strategy-type.js';
/**
 * The MergeStrategyReranker will call a reranker LLM to merge the given PerFilterSearchResult instances. This strategy adds latency, but yields good results.
 */
export type MergeStrategyReranker = {
  type?: MergeStrategyType;
  /**
   * The RerankerModel to use.
   * Default: "cohere-3.5".
   */
  model?: 'cohere-3.5' | null;
  /**
   * Key-value pairs to be included in the ranking process, to boost related chunks according to chunk content and metadata, if includeMetaData is true.
   */
  boosting?:
    | ({
        /**
         * Max Length: 1024.
         */
        key: string;
        value: string[];
        /**
         * PerFilterSearchResult ID or a new ID for each PostProcessingOperation.
         */
        scope: string[];
      } & Record<string, any>)[]
    | null;
  /**
   * If true, document and chunk metadata are sent to the reranker LLM along with the text content of the chunk.
   */
  includeAllMetaData?: boolean | null;
} & Record<string, any>;
