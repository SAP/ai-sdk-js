import {
  resolveDeploymentId,
  getOrchestrationDeploymentId
} from '@sap-ai-sdk/ai-api/internal.js';
import { jest } from '@jest/globals';

describe('OrchestrationClient deploymentId behavior', () => {
  it('does not call resolveDeployment when deploymentId is provided', async () => {
    const deploymentConfig = { deploymentId: 'test-deployment-id' };

    // Spy on the resolveDeployment function
    const spy = jest.spyOn({ resolveDeploymentId }, 'resolveDeploymentId');

    // Call getOrchestrationDeploymentId
    const result = await getOrchestrationDeploymentId(deploymentConfig);

    expect(result).toBe('test-deployment-id');
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
