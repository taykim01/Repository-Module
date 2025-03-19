export class LLMRepository {
    apiKeys;
    constructor(apiKeys) {
        this.apiKeys = apiKeys;
    }
    async generateQueryResults(messages, model, maxTokens) {
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
    async generateResponse(messages, format, model) {
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
        const response = data.choices[0].message.content;
        if (!response)
            throw new Error("No response from OpenAI");
        return response;
    }
    async generateEmbedding(input) {
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
        const vector = data.data[0].embedding;
        return vector;
    }
}
