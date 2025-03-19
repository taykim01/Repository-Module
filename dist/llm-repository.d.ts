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
export declare class LLMRepository {
    apiKeys: {
        openai?: string;
        perplexity?: string;
    };
    constructor(apiKeys: {
        openai?: string;
        perplexity?: string;
    });
    generateQueryResults(messages: ChatCompletionMessageParam[], model: string, maxTokens: number): Promise<{
        message: string;
        citations: string[];
    }>;
    generateResponse(messages: ChatCompletionMessageParam[], format: "json_object" | "text", model: string): Promise<string>;
    generateEmbedding(input: string): Promise<number[]>;
}
