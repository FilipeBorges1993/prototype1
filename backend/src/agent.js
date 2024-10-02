// * This is the agent code.
import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser } from "@langchain/schema/output_parser";

export async function agent(question) {
  const llm = new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-3-5-sonnet-20240620",
    temperature: 0,
  });

  // * Here i need to add the emails to the prompt
  const response = await fetch(
    "https://wingmaite.app.n8n.cloud/webhook-test/output/emails",
    {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + Buffer.from("sammy:12345678").toString("base64"),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const emailsData = await response.json();

  // Parse emailsData into a string
  const parsedEmails = emailsData
    .map((email, index) => {
      return `Email ${index + 1}:
    From: ${email.fromName} <${email.fromEmail}>
    Thread ID: ${email.threadId}
    Message ID: ${email.messageId}
    Content: ${email.emailText.replace(/\n/g, " ").trim()}
    `;
    })
    .join("\n\n");

  // Create a prompt template for email analysis
  const emailAnalysisTemplate = PromptTemplate.fromTemplate(`
    You are an AI assistant tasked with analyzing a set of emails and answering questions about them.

    Here are the emails:
    {emails}

    Please answer the following question about these emails:
    {question}

    Provide a detailed and accurate answer based solely on the information contained in the emails.
  `);

  // * Init the agent
  const chain = emailAnalysisTemplate.pipe(llm);

  const stream = await chain.stream({ question, emails: parsedEmails });

  // Collect the complete response
  let completeResponse = "";
  for await (const chunk of stream) {
    if (chunk?.content) {
      completeResponse += chunk.content;
    }
  }

  // Return the complete response
  return { content: completeResponse };
}
