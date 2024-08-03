import { chatCompletion, computeEmbedding } from "@sap-ai-sdk/sample-code";
import "dotenv/config";

describe("OpenAI Foundation Model Access", () => {
  it("should complete a chat", async () => {
    const result = await chatCompletion();
    expect(result).toBeDefined();
    expect(result).toContain('Paris');
  });

  it("should compute an embedding vector", async () => {
    const result = await computeEmbedding();
    expect(result).toBeDefined();
    expect(result).not.toHaveLength(0);
  });
});