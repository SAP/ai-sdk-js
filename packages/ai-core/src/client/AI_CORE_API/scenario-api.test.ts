import nock from 'nock';
import { AiScenarioList } from './schema/index.js';
import { ScenarioApi } from './scenario-api.js';
import { aiCoreDestination, mockClientCredentialsGrantCall } from '../../../../../test-util/mock-http.js';

describe('scenario', () => {
  beforeAll(() => {
    mockClientCredentialsGrantCall();
  })
  afterAll(() => {
    nock.cleanAll();
  });

  it('parses a successful response for get request', async () => {
    const expectedResponse: AiScenarioList = {
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
    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/lm/scenarios')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiScenarioList = await ScenarioApi.scenarioQuery({
      'AI-Resource-Group': 'default'
    }).execute();

    expect(result).toEqual(expectedResponse);
  });
});
