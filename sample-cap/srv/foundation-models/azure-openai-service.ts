import { AzureOpenAiService, ChatCompletions } from '#cds-models/AzureOpenAiService';
import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';

export = (srv: AzureOpenAiService) => {
  srv.on('CREATE', ChatCompletions.name, async req => {
    const { ID: _, ...chatCompletion } = req.data;
    console.log(JSON.stringify(chatCompletion));

    const response = await new AzureOpenAiChatClient('gpt-35-turbo').run(chatCompletion);
    return req.info(response.getContent());
  });
};