export interface LLMOptions {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

export interface PerplexityOptions {
  model: string;
  messages: LLMOptions[];
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

  async generateResponse(
    messages: LLMOptions[],
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

  async generateSearchResponse(
    options: PerplexityOptions
  ): Promise<{ message: string; citations: string[] }> {
    const payload = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKeys.perplexity}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model ?? "sonar-pro",
        messages: options.messages,
        max_tokens: options.max_tokens,
        temperature: options.temperature ?? 0.2,
        top_p: options.top_p ?? 0.9,
        search_domain_filter: options.search_domain_filter ?? null,
        return_images: options.return_images ?? false,
        return_related_questions: options.return_related_questions ?? false,
        search_recency_filter: options.search_recency_filter ?? "week",
        top_k: options.top_k ?? 0,
        stream: options.stream ?? false,
        presence_penalty: options.presence_penalty ?? 0,
        frequency_penalty: options.frequency_penalty ?? 1,
        response_format: options.response_format ?? null,
      }),
    };
    const res = await fetch(
      "https://api.perplexity.ai/chat/completions",
      payload
    );
    return res;
    // const data = await res.json();
    // const citations = data.citations;
    // const message = data.choices[0].message.content;

    // return { message, citations };
  }
}
