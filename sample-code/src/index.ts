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
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig,
  orchestrationCompletionMasking,
  orchestrationGrounding
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
