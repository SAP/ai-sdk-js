import {
  ChatModel,
  AzureOpenAiChatModel
} from '@sap-ai-sdk/core';

expect<ChatModel>('custom-model');
expect<AzureOpenAiChatModel>('custom-model');
expect<ChatModel>('gpt-4-32k');
