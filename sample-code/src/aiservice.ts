import { OpenAiClient } from '@sap-ai-sdk/gen-ai-hub';

const openAiClient = new OpenAiClient();

const deployments: { [model: string]: string } = {
    "gpt-4-32k": "d577d927380c98ea",
    "gpt-35-turbo": "d66d1927bf590375",
    "ada": "d0084a63ebd7bcd3"
}

export function chatCompletion() {
    const config = getConfig("gpt-35-turbo")
    return openAiClient.chatCompletion({
        ...config,
        "messages": [{ "role": "user", "content": "What is the capital of France?" }],
    }).then((response) => {
        return response.choices[0].message.content;
    });
}

export function computeEmbedding() {
    const config = getConfig("ada")
    return openAiClient.embeddings({
        ...config,
        "input": "Hello, world!"
    }).then((response) => {
        return response.data
    });
}

function getConfig(model: string) {
    return {
        "deploymentConfiguration": {
            "deploymentId": deployments[model]
        }
    }
}
