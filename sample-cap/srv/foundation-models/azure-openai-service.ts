import { AzureOpenAiService, ChatCompletions } from '#cds-models/AzureOpenAiService';
import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';

export = (srv: AzureOpenAiService) => {
  srv.on('CREATE', ChatCompletions.name, async req => {
    const { messages } = req.data;
    const response = await new AzureOpenAiChatClient('gpt-35-turbo').run({ messages });
    return req.reply({
      messages,
      content: response.getContent()
    });
  });
};