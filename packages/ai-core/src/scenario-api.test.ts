import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { Scenario, ScenarioApi, ScenarioList } from './index.js';

describe('scenario', () => {
  const destination: HttpDestination = {
    url: 'https://ai.example.com'
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('get scenario parses a successful response', async () => {
    nock(destination.url)
      .get('/lm/scenarios')
      .reply(
        200,
        {
          count: 1,
          resources: [
            {
              createdAt: '2024-02-22T17:57:23+00:00',
              description: 'AI Core Global Scenario for LLM Access',
              id: 'foundation-models',
              labels: [
                {
                  key: 'scenarios.ai.sap.com/llm',
                  value: 'true'
                }
              ],
              modifiedAt: '2024-05-08T08:41:23+00:00',
              name: 'foundation-models'
            }
          ]
        },
        {
          'Content-Type': 'application/json',
          'AI-Resource-Group': 'default'
        }
      );

    const result: ScenarioList = await ScenarioApi.scenarioQuery({
      'AI-Resource-Group': 'default'
    }).execute(destination);

    expect(result).not.toBeNull();
    expect(result.count).toEqual(1);
    expect(result.resources.length).toEqual(1);

    const scenario: Scenario = result.resources[0];
    expect(scenario.id).toEqual('foundation-models');
    expect(scenario.name).toEqual('foundation-models');
    expect(scenario.labels[0].key).toEqual('scenarios.ai.sap.com/llm');
    expect(scenario.labels[0].value).toEqual('true');
    expect(scenario.modifiedAt).toEqual('2024-05-08T08:41:23+00:00');
  });
});
