import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

export default class OrchestrationService {
  async chatCompletion(req: any) {
    const { template, placeholderValues } = req.data;
    const model = {
      name: 'gpt-4o'
    };
    const prompt = { template };

    const response = await new OrchestrationClient({
      promptTemplating: {
        model,
        prompt
      }
    }).chatCompletion({
      placeholderValues: mapPlaceholderValues(placeholderValues)
    });

    return response.getContent();
  }
}

/**
 * Map placeholder values since CAP does not support dynamic object keys.
 *
 * For example:
 *
 * ```ts
 * placeholderValues: [{
 *   name: 'param1',
 *   value: 'value1'
 * }]
 * ```
 * =>
 * ```ts
 * mappedPlaceholderValues: {
 *   param1: 'value1'
 * }
 * ```
 * @param inputParams - Array of `PlaceholderValue` entity.
 * @returns Mapped placeholder values for orchestration service.
 */
function mapPlaceholderValues(
  placeholderValues: { name: string; value: string }[]
): Record<string, string> {
  return placeholderValues.reduce(
    (acc, { name, value }) => ({ ...acc, [name]: value }),
    {} as Record<string, string>
  );
}
