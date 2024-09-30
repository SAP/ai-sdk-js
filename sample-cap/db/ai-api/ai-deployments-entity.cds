entity AiDeploymentsEntity {
  key id            : String @assert.format: '[\\w.-]{4,64}';
      deploymentUrl : String;
      status        : AiDeploymentStatus;
}

type AiDeploymentStatus : String enum {
  PENDING;
  RUNNING;
  COMPLETED;
  DEAD;
  STOPPING;
  STOPPED;
  UNKNOWN;
}
