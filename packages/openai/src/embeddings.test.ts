import { jest, describe, it, expect } from '@jest/globals';
import { Embeddings } from 'openai/resources/embeddings';
import { SapEmbeddings } from './embeddings.js';
import type { OpenAI } from 'openai';

const mockCreate = jest.fn<any>().mockResolvedValue({ data: [], model: '', usage: { prompt_tokens: 0, total_tokens: 0 } });

jest.spyOn(Embeddings.prototype, 'create').mockImplementation(mockCreate as any);

const fakeClient = {} as OpenAI;
const embeddings = new SapEmbeddings(fakeClient);

describe('SapEmbeddings', () => {
  describe('create', () => {
    it("injects model: '' before calling openai embeddings.create", async () => {
      await embeddings.create({ input: 'Hello, world!' });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: '', input: 'Hello, world!' }),
        undefined
      );
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await embeddings.create({ input: 'Hello' }, { signal: controller.signal });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: '' }),
        { signal: controller.signal }
      );
    });
  });
});
