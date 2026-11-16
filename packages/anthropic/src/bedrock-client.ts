import { getAiCoreDestination } from '@sap-ai-sdk/core';
import { ErrorWithCause, pick } from '@sap-cloud-sdk/util';

import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk';

import { anthropicConfigKeys } from './types.ts';

import type {
  SapAnthropicBedrockInvokeConfig,
  SapAnthropicBedrockInvokeOptions
} from './types.ts';
import type { Middleware } from '@anthropic-ai/sdk';

interface SapAnthropicBedrockClientOptions extends SapAnthropicBedrockInvokeConfig {
  baseURL: string;
  resourceGroup: string;
  sapOptions: SapAnthropicBedrockInvokeOptions;
}

/** @internal */
export function pickAnthropicConfig(
  options: SapAnthropicBedrockInvokeConfig = {}
): SapAnthropicBedrockInvokeConfig {
  return pick([...anthropicConfigKeys], options);
}

/**
 * Internal upstream client for deployment routing and SAP authentication.
 * @internal
 */
export class SapAnthropicBedrockClient extends AnthropicBedrock {
  private readonly deploymentUrl: URL;
  private readonly resourceGroup: string;
  private readonly sapOptions: SapAnthropicBedrockInvokeOptions;

  constructor(config: SapAnthropicBedrockClientOptions) {
    super({
      // Keep SAP context in the upstream options so withOptions() clones retain it.
      ...config,
      // Disable AWS signing and ambient AWS bearer tokens; SAP owns authentication.
      apiKey: '',
      skipAuth: true
    });
    this.deploymentUrl = new URL(config.baseURL);
    this.resourceGroup = config.resourceGroup;
    this.sapOptions = config.sapOptions;
  }

  protected override backendMiddleware(): readonly Middleware[] {
    return [
      // The upstream middleware adapts the request first and decodes the response last.
      ...super.backendMiddleware(),
      async (request, next, context) => {
        const url = new URL(request.url);
        const deploymentPath = this.deploymentUrl.pathname.endsWith('/')
          ? this.deploymentUrl.pathname.slice(0, -1)
          : this.deploymentUrl.pathname;
        const modelPrefix = `${deploymentPath}/model/`;
        const modelPath = url.pathname.slice(modelPrefix.length);
        const operationStart = modelPath.indexOf('/');
        if (
          url.origin !== this.deploymentUrl.origin ||
          !url.pathname.startsWith(modelPrefix) ||
          operationStart < 1 ||
          operationStart === modelPath.length - 1
        ) {
          throw new Error(
            `Unsupported SAP AI Core Bedrock request path: ${url.pathname}. Use a deployment-local Bedrock model operation.`
          );
        }
        // Preserve the operation suffix so new upstream model operations can pass through.
        url.pathname = deploymentPath + modelPath.slice(operationStart);

        const destination = await getAiCoreDestination(
          this.sapOptions.destination
        );
        const authToken = destination.authTokens?.[0];
        if (!authToken?.value || authToken.error) {
          const message =
            'Could not retrieve an authentication token from the AI Core destination.';
          throw authToken?.error
            ? new ErrorWithCause(message, new Error(authToken.error))
            : new Error(message);
        }

        const headers = new Headers(request.headers);
        headers.set('authorization', `Bearer ${authToken.value}`);
        headers.set('ai-resource-group', this.resourceGroup);
        headers.set(
          'ai-client-type',
          ['AI SDK JavaScript', this.sapOptions.clientType]
            .filter(Boolean)
            .join(',')
        );
        if (context.options?.stream) {
          headers.set('accept', 'application/vnd.amazon.eventstream');
        }

        return next({ ...request, url: url.toString(), headers });
      }
    ];
  }
}
