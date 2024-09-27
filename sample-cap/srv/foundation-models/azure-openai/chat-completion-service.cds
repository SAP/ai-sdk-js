using { ChatCompletionsEntity } from '../../../db/foundation-models/azure-openai/chat-completions-entity';

service ChatCompletionsService {
  entity ChatCompletions as projection on ChatCompletionsEntity;
}
