## Pre-requisites for AI Core Deployment
- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup)
- Create a configuration in AI Core using the `/configuration` endpoint
    - [Example Usage](#create-a-configuration)

## ArtifactApi

### Defined in
[packages/ai-core/src/artifact-api.ts](../packages/ai-core/src/artifact-api.ts)

### Methods
- artifactQuery
- artifactCreate
- artifactGet
- artifactCount

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

    try {
        const responseData: ArtifactCreationResponse = await ArtifactApi
            .artifactCreate(requestBody, {'AI-Resource-Group': 'default'})
            .execute(destination);
        return responseData;
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Artifact creation failed: ${apiError.message}`);     
    }
}
```
## ConfigurationApi

### Defined in
[packages/ai-core/src/configuration-api.ts](../packages/ai-core/src/configuration-api.ts)

### Methods
- configurationQuery
- configurationCreate
- configurationGet
- configuratoinCount

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

    try {
        const responseData: ConfigurationCreationResponse = await ConfigurationApi
            .configurationCreate(requestBody, {'AI-Resource-Group': 'default'})
            .execute(destination);
        return responseData;
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Configuration creation failed: ${apiError.message}`);     
    }
}   
```

## DeploymentApi

### Defined in
[packages/ai-core/src/deployment-api.ts](../packages/ai-core/src/deployment-api.ts)

### Methods
- deploymentQuery
- deploymentCreate
- deploymentGet
- deploymentModify
- deploymentBatchModify
- deploymentDelete
- deploymentCount
- kubesubmitV4DeploymentsGetLogs

Some use case examples are listed below. 

### Create a Deployment
```TypeScript
async function createDeployment() {
    
    const requestBody: DeploymentCreationRequest = {
      configurationId: '0a1b2c3d-4e5f6g7h'
    };
    
    try{
        const responseData: DeploymentCreationResponse = await DeploymentApi
            .deploymentCreate(requestBody, {'AI-Resource-Group': 'default'})
            .execute(destination);
        return responseData;
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Deployment creation failed: ${apiError.message}`);     
    }
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
        
        try {
            await DeploymentApi
                .deploymentModify(deploymentId, requestBody, {'AI-Resource-Group': 'default'})
                .execute(destination);
        } catch (errorData) {
            const apiError = errorData.response.data.error as ApiError;
            console.error('Status code:', errorData.response.status);
            throw new Error(`Deployment modification failed: ${apiError.message}`);     
        }
    }
    // Wait a few seconds for the deployment to stop
    try {
        return DeploymentApi.deploymentDelete(deploymentId, { 'AI-Resource-Group': 'default' }).execute(destination);
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Deployment deletion failed: ${apiError.message}`);     
    }
}
```
## ExecutionApi

### Defined in
[packages/ai-core/src/execution-api.ts](../packages/ai-core/src/execution-api.ts)

### Methods
- executionQuery
- executionCreate
- executionBatchModify
- executionGet
- executionModify
- executionDelete
- executionCount
- kubesubmitV4ExecutionsGetLogs

## ScenarioApi

### Defined in
[packages/ai-core/src/scenario-api.ts](../packages/ai-core/src/scenario-api.ts)

### Methods
- scenarioQuery
- scenarioGet
- scenarioQueryVersions