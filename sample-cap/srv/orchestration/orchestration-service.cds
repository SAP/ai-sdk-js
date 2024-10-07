using {
  Template,
  InputParam
} from '../../db/orchestration/orchestration-chat-completions-entity';

@path: 'orchestration'
service OrchestrationService {
  action chatCompletion(template : array of Template, inputParams : array of InputParam) returns String;
}
