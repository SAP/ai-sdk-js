@path: 'orchestration'
@requires: 'any'
service OrchestrationService {
  action chatCompletion(template : array of Template, placeholderValues : array of PlaceholderValue) returns String;
}

type Template {
  role    : String;
  content : String;
}

type PlaceholderValue {
  name  : String;
  value : String;
}
