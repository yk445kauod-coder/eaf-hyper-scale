import axios from 'axios';
import { LLMAdapter, Message } from './LLMAdapter.js';

export class HuggingFaceAdapter extends LLMAdapter {
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = "Egytronic/Egytronic_1.0") {
        super();
        this.apiKey = apiKey;
        this.model = model;
    }

    async generate(messages: Message[]): Promise<Message> {
        const url = `https://api-inference.huggingface.co/models/${this.model}`;
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:';
        
        const response = await axios.post(
            url,
            { inputs: prompt },
            { headers: { Authorization: `Bearer ${this.apiKey}` } }
        );

        const content = response.data[0]?.generated_text || '';
        return { role: 'assistant', content: content.split('assistant:').pop()?.trim() || content };
    }

    async generateWithTools(messages: Message[], tools: any[]): Promise<Message> {
        // For HF models, we rely on the Agent's system prompt to guide tool use
        return this.generate(messages);
    }
}
