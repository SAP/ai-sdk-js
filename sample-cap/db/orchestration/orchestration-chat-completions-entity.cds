using {cuid} from '@sap/cds/common';

entity OrchestrationChatCompletionsEntity : cuid {
  template : many Template;
  inputParams : many InputParam;
}

type Template {
  role    : String;
  content : String;
}

type InputParam {
  name  : String;
  value : String;
}
