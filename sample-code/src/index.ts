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
  getDeployment,
  getDeployments,
  createDeployment,
  stopDeployment,
  deleteDeployment
} from './ai-api/deployment-api.js';
export { getScenarios, getModelsInScenario } from './ai-api/scenario-api.js';
