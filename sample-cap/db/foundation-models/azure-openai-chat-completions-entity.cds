using { cuid } from '@sap/cds/common';

entity AzureOpenAiChatCompletionsEntity: cuid {
  messages: many Message;
}

type Message {
  role: String;
  content: String;
}
