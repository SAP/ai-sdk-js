// exported for e2e tests
export {
  chatCompletion,
  computeEmbedding,
  chatCompletionWithDestination
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
  orchestrationGroundingVector,
  orchestrationGroundingHelpSapCom,
  orchestrationChatCompletionImage,
  orchestrationResponseFormat,
  chatCompletionStreamWithJsonModuleConfig,
  chatCompletionStream,
  orchestrationToolCalling
} from './orchestration.js';
export {
  invoke,
  invokeChain,
  invokeRagChain
} from './langchain-azure-openai.js';
export {
  getDeployments,
  getDeploymentsWithDestination,
  createDeployment,
  stopDeployments,
  deleteDeployments
} from './ai-api/deployment-api.js';
export {
  getScenarios,
  getModelsInScenario
} from './ai-api/scenario-api.js';

export {
  createCollection,
  createDocumentsWithTimestamp,
  deleteCollection
} from './document-grounding.js';
