import { jest, describe, it, expect } from '@jest/globals';
import { Responses } from 'openai/resources/responses/responses';
import { SapResponses } from './responses.ts';
import type { OpenAI } from 'openai';

const mockCreate = jest.fn<any>().mockResolvedValue({ output: [] });
const mockParse = jest.fn<any>().mockResolvedValue({ output: [] });

jest.spyOn(Responses.prototype, 'create').mockImplementation(mockCreate as any);
jest.spyOn(Responses.prototype, 'parse').mockImplementation(mockParse as any);

const fakeClient = {} as OpenAI;
const responses = new SapResponses(fakeClient);

describe('SapResponses', () => {
  describe('create', () => {
    it('does not throw when model is undefined', async () => {
      await expect(responses.create({ input: 'Hello' })).resolves.not.toThrow();
    });

    it('does not throw when model is a ModelConfig object', async () => {
      await expect(
        responses.create({
          input: 'Hello',
          model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' }
        })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a DeploymentIdConfig object', async () => {
      await expect(
        responses.create({
          input: 'Hello',
          model: { deploymentId: 'd1234' }
        })
      ).resolves.not.toThrow();
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await responses.create({ input: 'Hello' }, { signal: controller.signal });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ input: 'Hello' }),
        { signal: controller.signal }
      );
      expect(mockCreate).toHaveBeenCalledWith(
        expect.not.objectContaining({ model: expect.anything() }),
        { signal: controller.signal }
      );
    });
  });

  describe('parse', () => {
    it('does not throw when model is undefined', async () => {
      await expect(responses.parse({ input: 'Hello' })).resolves.not.toThrow();
    });

    it('does not throw when model is a ModelConfig object', async () => {
      await expect(
        responses.parse({
          input: 'Hello',
          model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' }
        })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a DeploymentIdConfig object', async () => {
      await expect(
        responses.parse({
          input: 'Hello',
          model: { deploymentId: 'd1234' }
        })
      ).resolves.not.toThrow();
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await responses.parse({ input: 'Hello' }, { signal: controller.signal });
      expect(mockParse).toHaveBeenCalledWith(
        expect.objectContaining({ model: undefined }),
        { signal: controller.signal }
      );
    });
  });
});
