import {
  type EmbeddingModuleConfig,
  type EmbeddingRequest
} from '../orchestration-types.ts';

import type {
  EmbeddingsPostRequest,
  EmbeddingsOrchestrationConfig,
  EmbeddingsModuleConfigs
} from '../client/api/schema/index.ts';

/**
 * Constructs an embedding post request from the given configuration and request.
 * @internal
 */
export function constructEmbeddingPostRequest(
  config: EmbeddingModuleConfig,
  request: EmbeddingRequest
): EmbeddingsPostRequest {
  const orchestrationConfig: EmbeddingsOrchestrationConfig = {
    modules: buildEmbeddingModulesConfig(config)
  };

  const embeddingRequest: EmbeddingsPostRequest = {
    config: orchestrationConfig,
    input: {
      text: request.input,
      ...(request.type && { type: request.type })
    }
  };
  return embeddingRequest;
}

function buildEmbeddingModulesConfig(
  config: EmbeddingModuleConfig
): EmbeddingsModuleConfigs {
  const { embeddings, masking } = config;
  const { model } = embeddings;
  const { name, version, params } = model;

  const modules: EmbeddingsModuleConfigs = {
    embeddings: {
      model: {
        name,
        ...(version && { version }),
        ...(params && { params })
      }
    },
    ...(masking && Object.keys(masking).length && { masking })
  };

  return modules;
}
