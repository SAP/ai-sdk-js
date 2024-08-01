import { chatCompletion } from "@sap-ai-sdk/sample-code";

describe("OpenAI Foundation Model Access", () => {
  it("should complete a chat", async () => {
    const result = await chatCompletion();
    expect(result).toBeDefined();
  });
});