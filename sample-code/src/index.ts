// exported for e2e tests
export {
  chatCompletion,
  chatCompletionResilient,
  computeEmbedding,
  chatCompletionWithDestination,
  chatCompletionWithFunctionCall
  // eslint-disable-next-line import-x/no-internal-modules
} from './foundation-models/azure-openai.ts';
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
  orchestrationQwenChatCompletion
} from './orchestration.ts';
export {
  invoke,
  invokeWithStructuredOutputJsonSchema,
  invokeWithStructuredOutputToolCalling,
  invokeChain,
  invokeRagChain
} from './langchain-azure-openai.ts';
export {
  invokeChain as orchestrationInvokeChain,
  invokeChainWithFallbackConfigs as orchestrationInvokeChainWithFallbackConfigs,
  invokeLangGraphChain,
  invokeDynamicModelAgent,
  invokeLangGraphChainStream,
  invokeWithStructuredOutput as orchestrationInvokeWithStructuredOutput,
  streamChain,
  streamChainWithFallbackConfigs as orchestrationStreamChainWithFallbackConfigs
} from './langchain-orchestration.ts';
export {
  getDeployments,
  getDeploymentsWithDestination,
  createDeployment,
  stopDeployments,
  deleteDeployments
  // eslint-disable-next-line import-x/no-internal-modules
} from './ai-api/deployment-api.ts';
export {
  getScenarios,
  getModelsInScenario
  // eslint-disable-next-line import-x/no-internal-modules
} from './ai-api/scenario-api.ts';

export {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection,
  getPipelineStatus
} from './document-grounding.ts';

export {
  createPromptTemplate,
  deletePromptTemplate
} from './prompt-registry.ts';

export {
  predictWithSchema,
  predictAutomaticParsing,
  predictParquetFile,
  predictParquetBlob,
  predictWithSchemaCompressed,
  predictWithSchemaResilient
} from './rpt.ts';

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
} from './llm-batch.ts';

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
} from './openai.ts';
