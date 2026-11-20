import type { GlobalStreamOptions } from '../../client/api/schema/index.ts';
import type { ModuleStreamOptions } from '../../orchestration-streaming-types.ts';

export type NewStreamOptionsWithoutFallbacks = GlobalStreamOptions & {
  moduleOptions: ModuleStreamOptions;
};

export type NewStreamOptionsWithFallbacks = GlobalStreamOptions & {
  moduleOptions: ModuleStreamOptions[];
};
