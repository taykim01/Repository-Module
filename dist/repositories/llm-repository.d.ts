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
export declare class LLMRepository {
    apiKeys: {
        openai?: string;
        perplexity?: string;
    };
    constructor(apiKeys: {
        openai?: string;
        perplexity?: string;
    });
    generateResponse(messages: LLMOptions[], format: "json_object" | "text"): Promise<string>;
    generateSearchResponse(options: PerplexityOptions): Promise<{
        message: string;
        citations: string[];
    }>;
    generateEmbedding(input: string): Promise<number[]>;
}
export {};
