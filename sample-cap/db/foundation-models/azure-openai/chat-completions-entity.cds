using { cuid } from '@sap/cds/common';

entity ChatCompletionsEntity: cuid {
  messages: many Message;
}

type Message {
  role: String;
  content: String;
}
