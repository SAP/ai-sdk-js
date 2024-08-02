import { chatCompletion } from "../../sample-code/src/aiservice.js";

describe("OpenAI Foundation Model Access", () => {
  it("should complete a chat", async () => {
    const result = await chatCompletion();
    expect(result).toBeDefined();
  });
});