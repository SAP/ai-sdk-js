using { OrchestrationChatCompletionsEntity } from '../../db/orchestration/orchestration-chat-completions-entity';

@path: 'orchestration'
service OrchestrationService {
  entity ChatCompletions as projection on OrchestrationChatCompletionsEntity;
}
