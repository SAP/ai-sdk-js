export interface ChatModel extends AiCoreDeployment {
    type: 'chat';
  };
  
  export interface EmbeddingModel extends AiCoreDeployment {
    type: 'embedding';
  };
  
  export interface AiCoreDeployment {
    name: string;
    type: string;
    deploymentId?: string;
  }