import { expectAssignable, expectError, expectType } from 'tsd';
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import type {
  LangChainOrchestrationModuleConfig,
  LangChainOrchestrationModuleConfigList,
  OrchestrationCallOptions
} from '@sap-ai-sdk/langchain';

const singleConfig: LangChainOrchestrationModuleConfig = {
  promptTemplating: {
    model: {
      name: 'gpt-5'
    }
  }
};

const fallbackConfigs: LangChainOrchestrationModuleConfigList = [
  singleConfig,
  {
    promptTemplating: {
      model: {
        name: 'gpt-5-mini'
      }
    }
  }
];

expectType<OrchestrationClient>(new OrchestrationClient(singleConfig));
expectType<OrchestrationClient>(new OrchestrationClient(fallbackConfigs));

expectAssignable<Promise<unknown>>(
  new OrchestrationClient(fallbackConfigs).invoke('Hello')
);

expectAssignable<Promise<AsyncIterable<unknown>>>(
  new OrchestrationClient(fallbackConfigs).stream('Hello', {
    stop: ['END']
  } as OrchestrationCallOptions)
);

const emptyConfigList: LangChainOrchestrationModuleConfig[] = [];
expectError(new OrchestrationClient(emptyConfigList));
