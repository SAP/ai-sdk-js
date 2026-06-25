import { describe, expect, it, vi } from 'vitest';
import { Responses } from 'openai/resources/responses/responses';
import { SapResponses } from './responses.js';
import type { OpenAI } from 'openai';

const mockCreate = vi.fn<any>().mockResolvedValue({ output: [] });
const mockParse = vi.fn<any>().mockResolvedValue({ output: [] });

vi.spyOn(Responses.prototype, 'create').mockImplementation(mockCreate as any);
vi.spyOn(Responses.prototype, 'parse').mockImplementation(mockParse as any);

const fakeClient = {} as OpenAI;
const responses = new SapResponses(fakeClient);

describe('SapResponses', () => {
  describe('create', () => {
    it("injects model: '' before calling openai responses.create", async () => {
      await responses.create({ input: 'Hello' });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: '', input: 'Hello' }),
        undefined
      );
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await responses.create({ input: 'Hello' }, { signal: controller.signal });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: '' }),
        { signal: controller.signal }
      );
    });
  });

  describe('parse', () => {
    it("injects model: '' before calling openai responses.parse", async () => {
      await responses.parse({ input: 'Hello' });
      expect(mockParse).toHaveBeenCalledWith(
        expect.objectContaining({ model: '', input: 'Hello' }),
        undefined
      );
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await responses.parse({ input: 'Hello' }, { signal: controller.signal });
      expect(mockParse).toHaveBeenCalledWith(
        expect.objectContaining({ model: '' }),
        { signal: controller.signal }
      );
    });
  });
});
