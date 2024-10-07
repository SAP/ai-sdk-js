@path: 'orchestration'
service OrchestrationService {
  action chatCompletion(template : array of Template, inputParams : array of InputParam) returns String;
}

type Template {
  role    : String;
  content : String;
}

type InputParam {
  name  : String;
  value : String;
}
