import { jest, describe, it, expect } from '@jest/globals';
import { Embeddings } from 'openai/resources/embeddings';
import { SapEmbeddings } from './embeddings.ts';
import type { OpenAI } from 'openai';

const mockCreate = jest.fn<any>().mockResolvedValue({
  data: [],
  model: '',
  usage: { prompt_tokens: 0, total_tokens: 0 }
});

jest
  .spyOn(Embeddings.prototype, 'create')
  .mockImplementation(mockCreate as any);

const fakeClient = {} as OpenAI;
const embeddings = new SapEmbeddings(fakeClient);

describe('SapEmbeddings', () => {
  describe('create', () => {
    it('does not throw when model is undefined', async () => {
      await expect(
        embeddings.create({ input: 'Hello, world!' })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a ModelConfig object', async () => {
      await expect(
        embeddings.create({
          input: 'Hello, world!',
          model: { modelName: 'text-embedding-3-small' }
        })
      ).resolves.not.toThrow();
    });

    it('does not throw when model is a DeploymentIdConfig object', async () => {
      await expect(
        embeddings.create({
          input: 'Hello, world!',
          model: { deploymentId: 'd1234' }
        })
      ).resolves.not.toThrow();
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await embeddings.create(
        { input: 'Hello' },
        { signal: controller.signal }
      );
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: undefined }),
        { signal: controller.signal }
      );
    });
  });
});
