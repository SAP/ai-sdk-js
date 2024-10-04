import { Request as CdsRequest } from '@sap/cds';
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

export default class OrchestrationService {
  async chatCompletions(req: CdsRequest) {
    const { template, inputParams } = req.data;
    const llm = {
      model_name: 'gpt-4-32k',
      model_params: {}
    };
    const templating = { template };

    const mappedInputParams = inputParams.reduce(
      (acc, { name, value }) => {
        acc[name] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    const response = await new OrchestrationClient({
      llm,
      templating
    }).chatCompletion({
      inputParams: mappedInputParams
    });

    return response.getContent();
  }
}
