using { AzureOpenAiChatCompletionsEntity } from '../../db/foundation-models/azure-openai-chat-completions-entity';

@path: 'azure-openai'
service AzureOpenAiService {
  entity ChatCompletions as projection on AzureOpenAiChatCompletionsEntity;
}
