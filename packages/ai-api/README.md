# @sap-ai-sdk/ai-api

This package provides tools to manage your scenarios and workflows in SAP AI Core.

- Streamline data preprocessing and model training pipelines.
- Execute batch inference jobs.
- Deploy inference endpoints for your trained models.
- Register custom Docker registries, sync AI content from your own git repositories, and register your own object storage for training data and model artifacts.

### Installation

```
$ npm install @sap-ai-sdk/ai-api
```

## Pre-requisites

- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-api/sap-ai-api-service-guide/initial-setup).
- Project configured with Node.js v20 or higher and native ESM support enabled.
- For testing your application locally:
  - Download a service key for your AI Core service instance.
  - Create a `.env` file in the sample-code directory.
  - Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`.

## List of Available APIs

We maintain a list of [currently available and tested AI Core APIs](https://github.com/SAP/ai-sdk-js/blob/main/docs/list-tested-APIs.md)

## Usage

The examples below demonstrate the usage of the most commonly used APIs in SAP AI Core.

### ArtifactApi

#### Create an Artifact

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
            .execute();
        return responseData;
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Artifact creation failed: ${apiError.message}`);
    }
}
```

### ConfigurationApi

#### Create a Configuration

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
            .execute();
        return responseData;
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Configuration creation failed: ${apiError.message}`);
    }
}
```

### DeploymentApi

#### Create a Deployment

```TypeScript
async function createDeployment() {

    const requestBody: DeploymentCreationRequest = {
      configurationId: '0a1b2c3d-4e5f6g7h'
    };

    try{
        const responseData: DeploymentCreationResponse = await DeploymentApi
            .deploymentCreate(requestBody, {'AI-Resource-Group': 'default'})
            .execute();
        return responseData;
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Deployment creation failed: ${apiError.message}`);
    }
}
```

#### Delete a Deployment

Only deployments with `targetStatus: STOPPED` can be deleted. So a modification request must be sent before deletion can occur.

```TypeScript
async function modifyDeployment() {

    let deploymentId: string = '0a1b2c3d4e5f';

    const deployment: DeploymentResponseWithDetails = await DeploymentApi
        .deploymentGet(deploymentId, {}, {'AI-Resource-Group': 'default'})
        .execute();

    if(deployment.targetStatus === 'RUNNING') {
        // Only RUNNING deployments can be STOPPED.
        const requestBody: DeploymentModificationRequest = {
            targetStatus: 'STOPPED',
        };

        try {
            await DeploymentApi
                .deploymentModify(deploymentId, requestBody, {'AI-Resource-Group': 'default'})
                .execute();
        } catch (errorData) {
            const apiError = errorData.response.data.error as ApiError;
            console.error('Status code:', errorData.response.status);
            throw new Error(`Deployment modification failed: ${apiError.message}`);
        }
    }
    // Wait a few seconds for the deployment to stop
    try {
        return DeploymentApi.deploymentDelete(deploymentId, { 'AI-Resource-Group': 'default' }).execute();
    } catch (errorData) {
        const apiError = errorData.response.data.error as ApiError;
        console.error('Status code:', errorData.response.status);
        throw new Error(`Deployment deletion failed: ${apiError.message}`);
    }
}
```

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
