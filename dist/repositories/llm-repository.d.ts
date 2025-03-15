import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
interface PerplexityOptions {
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
export default class LLMRepository {
    apiKeys: {
        openai?: string;
        perplexity?: string;
    };
    openai: OpenAI;
    constructor(apiKeys: {
        openai?: string;
        perplexity?: string;
    });
    generateResponse(messages: ChatCompletionMessageParam[], format: "json_object" | "text"): Promise<string>;
    generateSearchResponse(options: PerplexityOptions): Promise<{
        message: string;
        citations: string[];
    }>;
    generateVisionResponse(messages: never[], format: "json_object" | "text"): Promise<string>;
    generateEmbedding(input: string): Promise<number[]>;
}
export {};
