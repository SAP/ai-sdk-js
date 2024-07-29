# Available APIs

last updated: 24.07.2024

✅ Available and tested

❗Warning: The APIs not marked as tested in this section are in an experimental state. Use them at your own risk.

# AI Core

- ApplicationAPI
- ArtifactApi ✅
- ConfigurationApi ✅
- DeploymentApi ✅
- DockerRegistrySecretApi
- ExecutableApi
- ExecutionApi ✅
- ExecutionScheduleApi
- FileApi
- KpiApi
- MetaApi
- MetricsApi
- ObjectStoreSecretApi
- RepositoryApi
- ResourceApi
- ResourceGroupApi
- ResourceQuotaApi
- ScenarioApi ✅
- SecretApi
- ServiceApi

## ArtifactApi

### Methods
- [artifactQuery](../packages/ai-core/src/artifact-api.ts#L29)
- [artifactCreate](../packages/ai-core/src/artifact-api.ts#L54)
- [artifactGet](../packages/ai-core/src/artifact-api.ts#L73)
- [artifactCount](../packages/ai-core/src/artifact-api.ts#L92)

Some use case examples are listed below.

### Create an Artifact
```TypeScript
async function createArtifact() {
    
    const requestBody: ArtifactPostData = {
        name: 'training-test-dataset',
        kind: 'dataset',
        url: 'https://ai.example.com',
        scenarioId: 'foundation-models'
    }

    const responseData: ArtifactCreationResponse = await ArtifactApi
        .artifactCreate(requestBody, {'AI-Resource-Group': 'default'})
        .execute(destination);
    
    if (!responseData) {
        throw new Error("Artifact creation failed: received null or undefined response");
    }
    return responseData;
}
```

### List all Artifacts
```TypeScript
async function listArtifact() {

    const responseData: ArtifactList = await ArtifactApi
        .artifactQuery({kind: 'dataset'}, {'AI-Resource-Group': 'i745181'})
        .execute(destination);

    if (!responseData) {
        throw new Error("No Artifacts found.");
    }
    return responseData;
}
```

## ConfigurationApi

### Methods
- [configurationQuery](../packages/ai-core/src/configuration-api.ts#L26)
- [configurationCreate](../packages/ai-core/src/configuration-api.ts#L50)
- [configurationGet](../packages/ai-core/src/configuration-api.ts#L69)
- [configuratoinCount](../packages/ai-core/src/configuration-api.ts#L91)

Some use case examples are listed below. 

### Create a Configuration
```TypeScript
async function createConfiguration() {
    const requestBody: ConfigurationBaseData = {
        name: 'gpt-35-turbo',
        executableId: 'azure-openai',
        scenarioId: 'foundation-models',
        parameterBindings: [
            {
              "key": "modelName",
              "value": "gpt-35-turbo"
            },
            {
              "key": "modelVersion",
              "value": "latest"
            }
        ],
        inputArtifactBindings: []
    }

    const responseData: ConfigurationCreationResponse = await ConfigurationApi
        .configurationCreate(requestBody, {'AI-Resource-Group': 'default'})
        .execute(destination);

    if (!responseData) {
        throw new Error("Configuration creation failed: received null or undefined response");
    }
    return responseData;
}   
```

## DeploymentApi

### Methods
- [deploymentQuery](../packages/ai-core/src/deployment-api.ts#L51)
- [deploymentCreate](../packages/ai-core/src/deployment-api.ts#L80)
- [deploymentGet](../packages/ai-core/src/deployment-api.ts#L117)
- [deploymentModify](../packages/ai-core/src/deployment-api.ts#L138)
- [deploymentBatchModify](../packages/ai-core/src/deployment-api.ts#L98)
- [deploymentDelete](../packages/ai-core/src/deployment-api.ts#L158)
- [deploymentCount](../packages/ai-core/src/deployment-api.ts#L178)
- [kubesubmitV4DeploymentsGetLogs](../packages/ai-core/src/deployment-api.ts#L205)

Some use case examples are listed below. 

### Create a Deployment
```TypeScript
async function createDeployment() {
    
    const requestBody: DeploymentCreationRequest = {
      configurationId: '0a1b2c3d-4e5f6g7h'
    };
    const responseData: DeploymentCreationResponse = await DeploymentApi
        .deploymentCreate(requestBody, {'AI-Resource-Group': 'default'})
        .execute(destination);
    
    if (!responseData) {
      throw new Error("Deployment creation failed: received null or undefined response");
    }

    return responseData;
}
```
### Delete a Deployment

Only deployments with `targetStatus: STOPPED` can be deleted. So a modification request must be sent before deletion can occur. 
```TypeScript
async function modifyDeployment() {

    let deploymentId: string = '0a1b2c3d4e5f';

    const deployment: DeploymentResponseWithDetails = await DeploymentApi
        .deploymentGet(deploymentId, {}, {'AI-Resource-Group': 'default'})
        .execute(destination);

    if(deployment.targetStatus === 'RUNNING') {
        // Only RUNNING deployments can be STOPPED. 
        const requestBody: DeploymentModificationRequest = {
            targetStatus: 'STOPPED',
        };
        
        await DeploymentApi
            .deploymentModify(deploymentId, requestBody, {'AI-Resource-Group': 'default'})
            .execute(destination);
    }
    // Wait a few seconds for the deployment to stop
    return DeploymentApi.deploymentDelete(deploymentId, { 'AI-Resource-Group': 'default' }).execute(destination);
}
```
## ExecutionApi

### Methods
- [executionQuery](../packages/ai-core/src/execution-api.ts#L51)
- [executionCreate](../packages/ai-core/src/execution-api.ts#L81)
- [executionBatchModify](../packages/ai-core/src/execution-api.ts#L99)
- [executionGet](../packages/ai-core/src/execution-api.ts#L118)
- [executionModify](../packages/ai-core/src/execution-api.ts#L139)
- [executionDelete](../packages/ai-core/src/execution-api.ts#L159)
- [executionCount](../packages/ai-core/src/execution-api.ts#L179)
- [kubesubmitV4ExecutionsGetLogs](../packages/ai-core/src/execution-api.ts#207)

## ScenarioApi

### Methods
- [scenarioQuery](../packages/ai-core/src/scenario-api.ts#L18)
- [scenarioGet](../packages/ai-core/src/scenario-api.ts#L28)
- [scenarioQueryVersions](../packages/ai-core/src/scenario-api.ts#L45)