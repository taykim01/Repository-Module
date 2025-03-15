import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import openai from "../infrastructures/open-ai";

export default class LLMRepository {
  async generateResponse(
    messages: ChatCompletionMessageParam[],
    format: "json_object" | "text"
  ): Promise<string> {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: messages,
      response_format: { type: format },
    });

    const response: string = chatCompletion.choices[0].message.content!;
    if (!response) throw new Error();

    return response;
  }

  async generateVisionResponse(
    messages: never[],
    format: "json_object" | "text"
  ): Promise<string> {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      response_format: { type: format },
    });

    const response: string = chatCompletion.choices[0].message.content!;
    if (!response) throw new Error();

    return response;
  }

  async generateEmbedding(input: string): Promise<number[]> {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input,
      encoding_format: "float",
    });
    const vector = embedding.data[0].embedding;
    return vector;
  }
}
