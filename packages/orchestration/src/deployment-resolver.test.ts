import {
  resolveDeploymentId,
  getOrchestrationDeploymentId
} from '@sap-ai-sdk/ai-api/internal.js';
import { describe, it, expect, vi } from 'vitest';

describe('OrchestrationClient deploymentId behavior', () => {
  it('does not call resolveDeployment when deploymentId is provided', async () => {
    const deploymentConfig = { deploymentId: 'test-deployment-id' };

    // Spy on the resolveDeployment function
    const spy = vi.spyOn({ resolveDeploymentId }, 'resolveDeploymentId');

    // Call getOrchestrationDeploymentId
    const result = await getOrchestrationDeploymentId(deploymentConfig);

    expect(result).toBe('test-deployment-id');
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
