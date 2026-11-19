import { OrchestrationConfigWithTemplateBuilder } from './orchestration-config-with-template-builder.ts';

import type {
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationConfigRefOverride
} from '../../orchestration-types.ts';
import type { CompletionApi } from '../orchestration-completion.ts';

/**
 * Intermediate builder for a request backed by a stored configuration reference.
 * Carries the reference until `withModules` selects the override modules and returns the builder that sends the request.
 * Obtain it from {@link CompletionApi.withConfigRef}.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationConfigRefBuilder {
  private configRef: OrchestrationConfigRefById | OrchestrationConfigRefByName;
  private client: CompletionApi;

  constructor(
    configRef: OrchestrationConfigRefById | OrchestrationConfigRefByName,
    client: CompletionApi
  ) {
    this.configRef = configRef;
    this.client = client;
  }

  /**
   * Select the override modules applied on top of the stored configuration.
   * The returned builder's `create` omits `prompt`, because the template is defined remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param override - A partial configuration to override parts of the stored configuration at request time. Omit it to send the stored configuration unchanged.
   * @returns A builder whose `create` sends the request.
   */
  withModules(
    override?: OrchestrationConfigRefOverride
  ): OrchestrationConfigWithTemplateBuilder {
    const configRef = override
      ? {
          ...this.configRef,
          overrideConfig: { ...this.configRef.overrideConfig, ...override }
        }
      : this.configRef;
    return new OrchestrationConfigWithTemplateBuilder(configRef, this.client);
  }
}
