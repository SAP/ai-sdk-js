// exported for e2e tests
export {
  chatCompletion,
  computeEmbedding,
  chatCompletionWithDestination
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
export { invokeChain as orchestrationInvokeChain } from './langchain-orchestration.js';
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
  deleteCollection
} from './document-grounding.js';
