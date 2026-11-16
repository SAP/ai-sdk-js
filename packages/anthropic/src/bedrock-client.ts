import {
  deploymentCache,
  extractModel,
  getAllDeployments
} from '@sap-ai-sdk/ai-api/internal.js';
import {
  formatAiClientTypeHeader,
  getAiCoreAuthToken
} from '@sap-ai-sdk/core/internal.js';
import { pick } from '@sap-cloud-sdk/util';

import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk';

import { anthropicConfigKeys } from './types.ts';

import type {
  DeploymentResolutionOptions,
  FoundationModel
} from '@sap-ai-sdk/ai-api/internal.js';

import type {
  SapAnthropicBedrockInvokeConfig,
  SapAnthropicBedrockInvokeOptions
} from './types.ts';
import type { Middleware } from '@anthropic-ai/sdk';

/**
 * Placeholder base URL replaced by the resolved deployment URL for every request.
 * @internal
 */
export const placeholderBaseUrl = 'https://sap-ai-core.invalid';

interface SapAnthropicBedrockClientOptions extends SapAnthropicBedrockInvokeConfig {
  sapOptions: Omit<SapAnthropicBedrockInvokeOptions, 'anthropicConfig'>;
}

/** @internal */
export function pickAnthropicConfig(
  options: SapAnthropicBedrockInvokeConfig = {}
): SapAnthropicBedrockInvokeConfig {
  return pick([...anthropicConfigKeys], options);
}

/**
 * Parse a request model as `modelName[:modelVersion]`.
 * @param model - Request model.
 * @returns The model used for deployment resolution.
 * @internal
 */
function parseModel(model: string): FoundationModel {
  const versionStart = model.lastIndexOf(':');
  return versionStart > 0
    ? {
        name: model.slice(0, versionStart),
        version: model.slice(versionStart + 1)
      }
    : { name: model };
}

/**
 * Resolve the URL of a running AWS Bedrock deployment by model name, `modelName:modelVersion`, or deployment ID.
 * Deployment IDs share the character set of model names, so model names take precedence.
 * @param model - Request model.
 * @param opts - Deployment resolution options without model.
 * @returns The deployment URL.
 * @internal
 */
async function resolveBedrockDeploymentUrl(
  model: string,
  opts: Omit<DeploymentResolutionOptions, 'model'>
): Promise<string> {
  const foundationModel = parseModel(model);
  const cachedUrl =
    deploymentCache.get({ ...opts, model: foundationModel })?.url ??
    deploymentCache.getById(opts, model)?.url;
  if (cachedUrl) {
    return cachedUrl;
  }

  const deployments = await getAllDeployments(opts);
  const deployment =
    deployments.find(candidate => {
      const { name, version } = extractModel(candidate) ?? {};
      return (
        name === foundationModel.name &&
        (!foundationModel.version || version === foundationModel.version)
      );
    }) ?? deployments.find(({ id }) => id === model);
  if (!deployment?.deploymentUrl) {
    throw new Error(
      `No running AWS Bedrock deployment with model name or deployment ID '${model}' found in resource group '${opts.resourceGroup}'.`
    );
  }
  return deployment.deploymentUrl;
}

/**
 * Internal upstream client for deployment routing and SAP authentication.
 * @internal
 */
export class SapAnthropicBedrockClient extends AnthropicBedrock {
  private readonly sapOptions: SapAnthropicBedrockClientOptions['sapOptions'];

  constructor(config: SapAnthropicBedrockClientOptions) {
    super({
      // Keep SAP context in the upstream options so withOptions() clones retain it.
      ...config,
      baseURL: placeholderBaseUrl,
      // Disable AWS signing and ambient AWS bearer tokens; SAP owns authentication.
      apiKey: '',
      skipAuth: true
    });
    this.sapOptions = config.sapOptions;
  }

  protected override backendMiddleware(): readonly Middleware[] {
    return [
      // The upstream middleware adapts the request first and decodes the response last.
      ...super.backendMiddleware(),
      async (request, next, context) => {
        const url = new URL(request.url);
        const [, modelSegment, operation] =
          url.pathname.match(/^\/model\/([^/]+)(\/.+)$/) ?? [];
        if (url.origin !== placeholderBaseUrl || !modelSegment) {
          throw new Error(
            `Unsupported SAP AI Core Bedrock request path: ${url.pathname}. Use a Bedrock model operation.`
          );
        }

        const { destination, clientType } = this.sapOptions;
        const resourceGroup = this.sapOptions.resourceGroup ?? 'default';
        const authToken = await getAiCoreAuthToken(
          destination,
          'Could not retrieve an authentication token from the AI Core destination.'
        );
        const deploymentUrl = new URL(
          await resolveBedrockDeploymentUrl(decodeURIComponent(modelSegment), {
            scenarioId: 'foundation-models',
            executableId: 'aws-bedrock',
            resourceGroup,
            destination
          })
        );
        // Preserve the operation suffix so new upstream model operations can pass through.
        deploymentUrl.pathname =
          deploymentUrl.pathname.replace(/\/$/, '') + operation;
        deploymentUrl.search = url.search;

        const headers = new Headers(request.headers);
        headers.set('authorization', `Bearer ${authToken}`);
        headers.set('ai-resource-group', resourceGroup);
        headers.set('ai-client-type', formatAiClientTypeHeader(clientType));
        if (context.options?.stream) {
          headers.set('accept', 'application/vnd.amazon.eventstream');
        }

        return next({ ...request, url: deploymentUrl.toString(), headers });
      }
    ];
  }
}
