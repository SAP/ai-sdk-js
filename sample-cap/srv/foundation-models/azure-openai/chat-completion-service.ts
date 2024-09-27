import { ChatCompletionsService, ChatCompletions } from '#cds-models/ChatCompletionsService';
import { AzureOpenAiChatClient, AzureOpenAiCreateChatCompletionRequest } from '@sap-ai-sdk/foundation-models';

export = (srv: ChatCompletionsService) => {
  srv.on('CREATE', ChatCompletions.name, async req => {
    const { ID: _, ...chatCompletion } = req.data as AzureOpenAiCreateChatCompletionRequest;
    console.log(JSON.stringify(chatCompletion));
    const response = await new AzureOpenAiChatClient('gpt-35-turbo').run(chatCompletion);
    return req.info(response.getContent());
  });
};