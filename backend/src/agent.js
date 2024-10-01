// * This is the agent code.
import { ChatAnthropic } from "@langchain/anthropic";

export async function agent(message) {
  const llm = new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-3-5-sonnet-20240620",
    temperature: 0,
  });

  return await llm.invoke(message);
}
