import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

export interface PerplexityOptions {
  model: string;
  messages: ChatCompletionMessageParam[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  search_domain_filter?: null;
  return_images?: boolean;
  return_related_questions?: boolean;
  search_recency_filter?: string;
  top_k?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
  response_format?: null;
}

export class LLMRepository {
  constructor(public apiKeys: { openai?: string; perplexity?: string }) {}

  async generateQueryResults(
    messages: ChatCompletionMessageParam[],
    model: string,
    maxTokens: number
  ): Promise<{ message: string; citations: string[] }> {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKeys.perplexity}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
      }),
    });
    const data = await res.json();

    const citations = data.citations ?? [];
    const message = data.choices[0].message.content;
    return { message, citations };
  }

  async generateResponse(
    messages: ChatCompletionMessageParam[],
    format: "json_object" | "text",
    model: string
  ): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.openai}`,
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: format },
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API returned an error: ${res.statusText}`);
    }

    const data = await res.json();
    const response: string = data.choices[0].message.content;
    if (!response) throw new Error("No response from OpenAI");

    return response;
  }

  async generateEmbedding(input: string): Promise<number[]> {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.openai}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-large",
        input: input,
        encoding_format: "float",
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.statusText}`);
    }

    const data = await res.json();
    const vector: number[] = data.data[0].embedding;
    return vector;
  }
}
