import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
});
export default openai;
