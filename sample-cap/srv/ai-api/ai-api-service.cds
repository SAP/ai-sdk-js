using { AiDeploymentsEntity } from '../../db/ai-api/ai-deployments-entity';

@path: 'ai-api'
service AiApiService {
  entity Deployments as projection on AiDeploymentsEntity;
}
