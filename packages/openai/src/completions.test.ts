import { Completions } from 'openai/resources/chat/completions/completions';
import { SapCompletions } from './completions.js';
import type { OpenAI } from 'openai';

const mockCreate = vi.fn<any>().mockResolvedValue({ choices: [] });
const mockParse = vi.fn<any>().mockResolvedValue({ choices: [] });

vi.spyOn(Completions.prototype, 'create').mockImplementation(mockCreate as any);
vi.spyOn(Completions.prototype, 'parse').mockImplementation(mockParse as any);

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
