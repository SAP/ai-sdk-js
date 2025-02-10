import { buildDocumentGroundingConfig } from './grounding.js';
import type { DocumentGroundingServiceConfig } from '../orchestration-types.js';

describe('document grounding util', () => {
  it('builds grounding configuration with minimal required properties', () => {
    const groundingConfig: DocumentGroundingServiceConfig = {
      filters: [{}],
      input_params: ['input'],
      output_param: 'output'
    };
    expect(buildDocumentGroundingConfig(groundingConfig)).toEqual({
      type: 'document_grounding_service',
      config: {
        filters: [
          {
            data_repository_type: 'vector'
          }
        ],
        input_params: ['input'],
        output_param: 'output'
      }
    });
  });

  it('overrides default data repository type', () => {
    const groundingConfig: DocumentGroundingServiceConfig = {
      filters: [
        {
          data_repositories: ['repo1', 'repo2'],
          data_repository_type: 'help.sap.com'
        }
      ],
      input_params: ['input'],
      output_param: 'output'
    };
    expect(buildDocumentGroundingConfig(groundingConfig)).toEqual({
      type: 'document_grounding_service',
      config: {
        filters: [
          {
            data_repositories: ['repo1', 'repo2'],
            data_repository_type: 'help.sap.com'
          }
        ],
        input_params: ['input'],
        output_param: 'output'
      }
    });
  });
});
