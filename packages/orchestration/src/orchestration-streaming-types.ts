import type {
  FilteringStreamOptions,
  GlobalStreamOptions
} from './client/api/schema/index.ts';

/**
 * Shared stream options applied to all module configurations.
 */
export interface ModuleStreamOptions {
  /**
   * LLM specific stream options.
   */
  promptTemplating?: { include_usage?: boolean; [key: string]: any } | null;
  /**
   * Output filtering stream options.
   */
  outputFiltering?: FilteringStreamOptions;
}

type BaseStreamOptions = ModuleStreamOptions & {
  /**
   * Global stream options.
   */
  global?: GlobalStreamOptions;
};

/**
 * Base stream options without per-config overrides.
 */
export type StreamOptionsWithoutOverrides = BaseStreamOptions & {
  /**
   * Please use `StreamOptionsWithOverrides` if you want to specify per-config stream options for module fallback.
   */
  overrides?: never;
};

/**
 * Stream options with support for per-config overrides in module fallback scenarios.
 * The `overrides` property allows you to specify stream options that apply to specific module configurations by their index in the fallback list.
 * If an override is not provided for a config, it will use the shared options defined in `StreamOptionsWithoutOverrides`.
 * Overrides do not merge with shared options.
 */
export type StreamOptionsWithOverrides = BaseStreamOptions & {
  /**
   * Per-config stream options that override shared settings.
   * Use object numeric keys for config indices you want to override.
   * Omit keys for configs that should use shared options or set their value to undefined.
   * @example
   * ```typescript
   *
   * const optionsWithOverrides: StreamOptions = {
   *   global: { chunk_size: 100 },
   *   promptTemplating: { include_usage: false },
   *   overrides: {
   *     0: { promptTemplating: { include_usage: true } },  // config 0, replaces base options fully
   *     // 1: resolves base options because no override is provided (`{ promptTemplating: { include_usage: false } }`)
   *     2: { outputFiltering: { overlap: 50 } }            // config 2, replaces base options fully
   *   }
   * };
   * ```
   */
  overrides: Partial<Record<number, ModuleStreamOptions>>;
};

/**
 * Stream options for orchestration requests.
 * Either shared stream options for every module configuration or stream options with per-config overrides for module fallback.
 */
export type StreamOptions =
  | StreamOptionsWithoutOverrides
  | StreamOptionsWithOverrides;
