import { createCompletionApi } from './orchestration-completion.ts';

import type {
  DeploymentIdConfig,
  ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

import type { CompletionApi } from './orchestration-completion.ts';

/**
 * Client for the SAP AI Core Orchestration Service that exposes a fluent builder API.
 * Construct it with connection information only, then reach a capability such as {@link completion} and choose a configuration source on it.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class Orchestration {
  /**
   * Completion API for the orchestration service.
   * Call it directly to select a configuration source by shape, or call one of its `use*` methods to select a source explicitly, then call `create` on the returned builder.
   * @experimental This property is experimental and may change at any time without prior notice.
   */
  completion: CompletionApi;

  /**
   * Creates an instance of the orchestration client with connection information only.
   * @param options - Connection information: a {@link ResourceGroupConfig} or {@link DeploymentIdConfig} to scope the deployment, or a `{ destination }` object. Omit to resolve the deployment from the default resource group.
   */
  constructor(
    options: (ResourceGroupConfig | DeploymentIdConfig) & {
      destination?: HttpDestinationOrFetchOptions;
    } = {}
  ) {
    this.completion = createCompletionApi(options);
  }
}
