import { OrchestrationService, ChatCompletions } from '#cds-models/OrchestrationService';
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

export = (srv: OrchestrationService) => {
  srv.on('CREATE', ChatCompletions.name, async req => {
    const { template, inputParams } = req.data;
    const llm = {
      model_name: 'gpt-4-32k',
      model_params: {}
    }
    const templating = { template };

    const mappedInputParams = inputParams.reduce((acc, {name, value}) => {
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const response = await new OrchestrationClient({ llm, templating }).chatCompletion({
      inputParams: mappedInputParams
    });

    return req.info(response.getContent());
  });
};

