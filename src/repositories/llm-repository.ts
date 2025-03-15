import OpenAI from "openai";

interface LLMOptions {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

interface PerplexityOptions {
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
  public openai: OpenAI;

  constructor(public apiKeys: { openai?: string; perplexity?: string }) {
    this.openai = new OpenAI({
      apiKey: this.apiKeys.openai,
    });
  }

  async generateResponse(
    messages: LLMOptions[],
    format: "json_object" | "text"
  ): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: messages,
      response_format: { type: format },
    });

    const response: string = chatCompletion.choices[0].message.content!;
    if (!response) throw new Error();

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
      body: `{"model":${
        options.model ?? "sonar-pro"
      },"messages":${JSON.stringify(options.messages)},"max_tokens":${
        options.max_tokens
      },"temperature":${options.temperature ?? 0.2},"top_p":${
        options.top_p ?? 0.9
      },"search_domain_filter":${
        options.search_domain_filter ?? null
      },"return_images":${
        options.return_images ?? false
      },"return_related_questions":${
        options.return_related_questions ?? false
      },"search_recency_filter":${options.return_images ?? false}${
        options.search_recency_filter ?? "week"
      },"top_k":${options.top_k ?? 0},"stream":${
        options.stream ?? false
      },"presence_penalty":${
        options.presence_penalty ?? 0
      },"frequency_penalty":${
        options.frequency_penalty ?? 1
      },"response_format":${options.response_format ?? null}}`,
    };

    const res = await fetch(
      "https://api.perplexity.ai/chat/completions",
      payload
    );
    const data = await res.json();
    const citations = data.citations;
    const message = data.choices[0].message.content;

    return { message, citations };
  }

  async generateVisionResponse(
    messages: never[],
    format: "json_object" | "text"
  ): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      response_format: { type: format },
    });

    const response: string = chatCompletion.choices[0].message.content!;
    if (!response) throw new Error();

    return response;
  }

  async generateEmbedding(input: string): Promise<number[]> {
    const embedding = await this.openai.embeddings.create({
      model: "text-embedding-3-large",
      input,
      encoding_format: "float",
    });
    const vector = embedding.data[0].embedding;
    return vector;
  }
}
