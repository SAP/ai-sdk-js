// mapResponseToChatResult
// mapLangchainToAiClient

describe('Mapping Functions', () => {
    const testObject = {};
    it('should complete a chat', async () => {
      const result = await generate();
      expect(result).toBeDefined();
      expect(result).toContain('Paris');
    });

    it('should compute an embedding vector', async () => {
      const result = await embedQuery();
      expect(result).toBeDefined();
      expect(result).not.toHaveLength(0);
    });
  });
