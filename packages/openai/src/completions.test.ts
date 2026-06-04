import { jest, describe, it, expect } from '@jest/globals';
import { Completions } from 'openai/resources/chat/completions/completions';
import { SapCompletions } from './completions.js';
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
    it("injects model: '' before calling openai completions.create", async () => {
      await completions.create({
        messages: [{ role: 'user', content: 'Hello' }]
      });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: '',
          messages: [{ role: 'user', content: 'Hello' }]
        }),
        undefined
      );
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await completions.create(
        { messages: [{ role: 'user', content: 'Hello' }] },
        { signal: controller.signal }
      );
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: '' }),
        { signal: controller.signal }
      );
    });
  });

  describe('parse', () => {
    it("injects model: '' before calling openai completions.parse", async () => {
      await completions.parse({
        messages: [{ role: 'user', content: 'Hello' }]
      });
      expect(mockParse).toHaveBeenCalledWith(
        expect.objectContaining({
          model: '',
          messages: [{ role: 'user', content: 'Hello' }]
        }),
        undefined
      );
    });

    it('passes request options through', async () => {
      const controller = new AbortController();
      await completions.parse(
        { messages: [{ role: 'user', content: 'Hello' }] },
        { signal: controller.signal }
      );
      expect(mockParse).toHaveBeenCalledWith(
        expect.objectContaining({ model: '' }),
        { signal: controller.signal }
      );
    });
  });
});
