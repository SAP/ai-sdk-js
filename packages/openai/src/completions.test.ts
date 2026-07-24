import { jest, describe, it, expect } from '@jest/globals';
import { Completions } from 'openai/resources/chat/completions/completions';
import { SapCompletions } from './completions.ts';
import type { OpenAI } from 'openai';

const mockCreate = jest.fn<any>().mockResolvedValue({ choices: [] });
const mockParse = jest.fn<any>().mockResolvedValue({ choices: [] });

jest
  .spyOn(Completions.prototype, 'create')
  .mockImplementation(mockCreate as any);
jest.spyOn(Completions.prototype, 'parse').mockImplementation(mockParse as any);

const fakeClient = {} as OpenAI;
const completions = new SapCompletions(fakeClient);

describe('SapCompletions', () => {
  describe('create', () => {
    it('does not throw when model is undefined', async () => {
      await expect(
        completions.create({ messages: [{ role: 'user', content: 'Hello' }] })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a ModelConfig object', async () => {
      await expect(
        completions.create({
          messages: [{ role: 'user', content: 'Hello' }],
          model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' }
        })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a DeploymentIdConfig object', async () => {
      await expect(
        completions.create({
          messages: [{ role: 'user', content: 'Hello' }],
          model: { deploymentId: 'd1234' }
        })
      ).resolves.not.toThrow();
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await completions.create(
        { messages: [{ role: 'user', content: 'Hello' }] },
        { signal: controller.signal }
      );
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: undefined }),
        { signal: controller.signal }
      );
    });
  });

  describe('parse', () => {
    it('does not throw when model is undefined', async () => {
      await expect(
        completions.parse({ messages: [{ role: 'user', content: 'Hello' }] })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a ModelConfig object', async () => {
      await expect(
        completions.parse({
          messages: [{ role: 'user', content: 'Hello' }],
          model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' }
        })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a DeploymentIdConfig object', async () => {
      await expect(
        completions.parse({
          messages: [{ role: 'user', content: 'Hello' }],
          model: { deploymentId: 'd1234' }
        })
      ).resolves.not.toThrow();
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await completions.parse(
        { messages: [{ role: 'user', content: 'Hello' }] },
        { signal: controller.signal }
      );
      expect(mockParse).toHaveBeenCalledWith(
        expect.objectContaining({ model: undefined }),
        { signal: controller.signal }
      );
    });
  });
});
