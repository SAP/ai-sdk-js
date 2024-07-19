import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { ScenarioApi, ScenarioList } from './index.js';

describe('scenario', () => {
  const destination: HttpDestination = {
    url: 'https://ai.example.com'
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('parses a successful response for get request', async () => {
    const expectedResponse: ScenarioList = {
      count: 1,
      resources: [
        {
          createdAt: '2024-02-22T17:57:23+00:00',
          description: 'AI Core Global Scenario for LLM Access',
          id: 'foundation-models',
          labels: [
            {
              key: 'scenarios.example.com/llm',
              value: 'true'
            }
          ],
          modifiedAt: '2024-05-08T08:41:23+00:00',
          name: 'foundation-models'
        }
      ]
    };
    nock(destination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/lm/scenarios')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: ScenarioList = await ScenarioApi.scenarioQuery({
      'AI-Resource-Group': 'default'
    }).execute(destination);

    expect(result).toEqual(expectedResponse);
  });
});
