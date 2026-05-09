import axios from 'axios';
import { LLMAdapter, Message } from './LLMAdapter.js';

export class CloudflareAdapter extends LLMAdapter {
    private accountId: string;
    private apiToken: string;
    private model: string;

    constructor(accountId: string, apiToken: string, model: string = "@cf/meta/llama-3-8b-instruct") {
        super();
        this.accountId = accountId;
        this.apiToken = apiToken;
        this.model = model;
    }

    async generate(messages: Message[]): Promise<Message> {
        const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`;
        
        try {
            const response = await axios.post(
                url,
                { messages: messages.map(m => ({ role: m.role, content: m.content })) },
                { 
                    headers: { 
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (response.data && response.data.result) {
                return { role: 'assistant', content: response.data.result.response };
            } else {
                throw new Error(`Unexpected response from Cloudflare: ${JSON.stringify(response.data)}`);
            }
        } catch (error: any) {
            console.error('Cloudflare API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async generateWithTools(messages: Message[], tools: any[]): Promise<Message> {
        // Since Cloudflare REST API might not support native tool calling for all models,
        // we inject the tool definitions into the first system message if not already there.
        // The Agent class already handles parsing JSON tool calls from the content.
        
        const toolInstructions = `\n\nIf you need to use a tool, respond ONLY with a JSON object in this format:
{"tool_calls": [{"id": "call_unique", "type": "function", "function": {"name": "tool_name", "arguments": {"arg1": "value1"}}}]}

Available tools details:
${JSON.stringify(tools, null, 2)}`;

        const modifiedMessages = [...messages];
        if (modifiedMessages[0] && modifiedMessages[0].role === 'system') {
            if (!modifiedMessages[0].content.includes('Available tools details:')) {
                modifiedMessages[0].content += toolInstructions;
            }
        }

        return this.generate(modifiedMessages);
    }
}
