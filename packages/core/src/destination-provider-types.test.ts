import type { HttpDestination } from '@sap-cloud-sdk/connectivity';
import type { DestinationProvider } from './destination-provider-types.js';

describe('destination-provider-types', () => {
  const mockDestination: HttpDestination = {
    url: 'https://api.ai.example.com'
  };

  it('supports sync provider returning destination', () => {
    const provider: DestinationProvider = () => mockDestination;
    const result = provider();
    expect(result).toEqual(mockDestination);
  });

  it('supports async provider returning destination', async () => {
    const provider: DestinationProvider = async () => mockDestination;
    const result = await provider();
    expect(result).toEqual(mockDestination);
  });
});
