// exported for e2e tests
export {
  chatCompletion,
  chatCompletionResilient,
  computeEmbedding,
  chatCompletionWithDestination,
  chatCompletionWithFunctionCall
  // eslint-disable-next-line import-x/no-internal-modules
} from './foundation-models/azure-openai.js';
export {
  orchestrationChatCompletion,
  orchestrationChatCompletionResilient,
  orchestrationTemplating,
  orchestrationPromptRegistry,
  orchestrationCompletionPromptRegistryScoped,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig,
  orchestrationCompletionMasking,
  orchestrationMaskGroundingInput,
  orchestrationFromJson,
  orchestrationGrounding,
  orchestrationChatCompletionImage,
  orchestrationChatCompletionFile,
  orchestrationChatCompletionCsvFile,
  orchestrationChatCompletionDocxFile,
  orchestrationChatCompletionMp3File,
  orchestrationResponseFormat,
  chatCompletionStreamWithJsonModuleConfig,
  chatCompletionStream,
  orchestrationMessageHistoryWithToolCalling,
  orchestrationTranslation,
  orchestrationEmbeddingWithMasking,
  OrchestrationConfigRef,
  orchestrationWithFallbackConfigs,
  orchestrationSonarWithCitations,
  orchestrationSonarStreamWithCitations,
  orchestrationStreamWithFallbackConfigs,
  orchestrationQwenChatCompletion,
  orchestrationQwenResponseFormat,
  orchestrationQwenWithToolCalling
} from './orchestration.js';
export {
  invoke,
  invokeWithStructuredOutputJsonSchema,
  invokeWithStructuredOutputToolCalling,
  invokeChain,
  invokeRagChain
} from './langchain-azure-openai.js';
export {
  invokeChain as orchestrationInvokeChain,
  invokeChainWithFallbackConfigs as orchestrationInvokeChainWithFallbackConfigs,
  invokeLangGraphChain,
  invokeDynamicModelAgent,
  invokeLangGraphChainStream,
  invokeWithStructuredOutput as orchestrationInvokeWithStructuredOutput,
  streamChain,
  streamChainWithFallbackConfigs as orchestrationStreamChainWithFallbackConfigs
} from './langchain-orchestration.js';
export {
  getDeployments,
  getDeploymentsWithDestination,
  createDeployment,
  stopDeployments,
  deleteDeployments
  // eslint-disable-next-line import-x/no-internal-modules
} from './ai-api/deployment-api.js';
export {
  getScenarios,
  getModelsInScenario
  // eslint-disable-next-line import-x/no-internal-modules
} from './ai-api/scenario-api.js';

export {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  getPipelineStatus
} from './document-grounding.js';

export {
  createPromptTemplate,
  deletePromptTemplate
} from './prompt-registry.js';

export {
  predictWithSchema,
  predictAutomaticParsing,
  predictParquetFile,
  predictParquetBlob,
  predictWithSchemaCompressed,
  predictWithSchemaResilient
} from './rpt.js';

export {
  listBatches,
  createBatch,
  getBatchById,
  getBatchStatus,
  cancelBatch,
  deleteBatch,
  downloadBatchOutput,
  uploadBatchInput,
  deleteFile
} from './llm-batch.js';

export {
  chatCompletion as openAiChatCompletion,
  chatCompletionStream as openAiChatCompletionStream,
  chatCompletionParse as openAiChatCompletionParse,
  computeEmbedding as openAiComputeEmbedding,
  chatCompletionPerRequestModel as openAiChatCompletionPerRequestModel,
  responsesApi,
  responsesApiStream,
  responsesApiParse,
  responsesApiStateful,
  responsesApiMultiTurn
} from './openai.js';
