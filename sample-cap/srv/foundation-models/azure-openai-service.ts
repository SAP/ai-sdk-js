import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';

export default class AzureOpenAiService {
  async chatCompletion(req: any) {
    const { messages } = req.data;
    const response = await new AzureOpenAiChatClient('gpt-5').run({
      messages
    });
    return response.getContent();
  }
}
