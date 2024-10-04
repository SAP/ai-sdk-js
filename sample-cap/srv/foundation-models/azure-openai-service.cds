using {Message} from '../../db/foundation-models/azure-openai-chat-completions-entity';

@path: 'azure-openai'
service AzureOpenAiService {
  action chatCompletions(messages : array of Message) returns String;
}
