@path: 'azure-openai'
@requires: 'any'
service AzureOpenAiService {
  action chatCompletion(messages : array of Message) returns String;
}

type Message {
  role    : String;
  content : String;
}
