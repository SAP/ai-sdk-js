// exported for e2e tests
export {
  chatCompletion,
  computeEmbedding
  // eslint-disable-next-line import/no-internal-modules
} from './foundation-models/azure-openai.js';
export {
  orchestrationChatCompletion,
  orchestrationTemplating,
  orchestrationInputFiltering,
  orchestrationOutputFiltering,
  orchestrationRequestConfig,
  orchestrationCompletionMasking
} from './orchestration.js';
export {
  invoke,
  invokeChain,
  invokeRagChain
} from './langchain-azure-openai.js';
export {
  getDeployments,
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
  getCollection,
  deleteCollection,
  createDocument
  // eslint-disable-next-line import/no-internal-modules
} from './rage/vector-api.js';
export {
  searchCollection
  // eslint-disable-next-line import/no-internal-modules
} from './rage/retrieval-api.js';
