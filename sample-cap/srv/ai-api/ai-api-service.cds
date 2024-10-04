@path: 'ai-api'
service AiApiService {
  // entity Deployments as projection on AiDeploymentsEntity;
  action getDeployments() returns String;
}
