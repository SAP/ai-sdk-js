// exported for e2e tests
export {
  chatCompletion,
  computeEmbedding,
  chatCompletionWithDestination,
  chatCompletionWithFunctionCall
  // eslint-disable-next-line import/no-internal-modules
} from './foundation-models/azure-openai.js';
export {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationPromptRegistry,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig,
  orchestrationCompletionMasking,
  orchestrationMaskGroundingInput,
  orchestrationFromJson,
  orchestrationGrounding,
  orchestrationChatCompletionImage,
  orchestrationResponseFormat,
  chatCompletionStreamWithJsonModuleConfig,
  chatCompletionStream,
  orchestrationMessageHistoryWithToolCalling,
  orchestrationTranslation
} from './orchestration.js';
export {
  invoke,
  invokeChain,
  invokeRagChain
} from './langchain-azure-openai.js';
export {
  invokeChain as orchestrationInvokeChain,
  invokeLangGraphChain,
  streamChain
} from './langchain-orchestration.js';
export {
  getDeployments,
  getDeploymentsWithDestination,
  createDeployment,
  stopDeployments,
  deleteDeployments
  // eslint-disable-next-line import/no-internal-modules
} from './ai-api/deployment-api.js';
export {
  getScenarios,
  getModelsInScenario
  // eslint-disable-next-line import/no-internal-modules
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
  runTravelAssistant
} from './tutorials/agent-workflow-openai-langchain.js';
