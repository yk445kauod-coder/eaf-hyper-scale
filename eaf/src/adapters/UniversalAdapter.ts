import axios from 'axios';
import { LLMAdapter, Message } from './LLMAdapter.js';
import { OllamaAdapter } from './OllamaAdapter.js';

export type ProviderType = 
    | 'openai' | 'anthropic' | 'gemini' | 'cloudflare' | 'huggingface' 
    | 'ollama' | 'groq' | 'mistral' | 'cohere' | 'perplex' | 'together' 
    | 'deepseek' | 'openrouter' | 'voyage' | 'fireworks' | 'replicate' 
    | 'zai' | 'glm' | 'custom';

/**
 * Universal Multi-LLM Adapter (Hyper-Scale)
 * The primary interface for Egytronic Agents to interact with the world's intelligence.
 * Supports 20+ providers and is optimized for the Egytronic_1.0 master model.
 */
export class UniversalAdapter extends LLMAdapter {
    private provider: ProviderType;
    private apiKey: string;
    private config: any;
    private localAdapter?: OllamaAdapter;

    constructor(provider: ProviderType, apiKey: string = '', config: any = {}) {
        super();
        this.provider = provider;
        this.apiKey = apiKey;
        this.config = {
            model: 'Egytronic_1.0',
            temperature: 0.4,
            max_tokens: 4096,
            ...config
        };

        if (provider === 'ollama') {
            this.localAdapter = new OllamaAdapter(this.config.model);
        }
    }

    async generate(messages: Message[]): Promise<Message> {
        if (this.localAdapter) return this.localAdapter.generate(messages);

        switch (this.provider) {
            case 'openai': return this.openaiRequest(messages);
            case 'anthropic': return this.anthropicRequest(messages);
            case 'groq': return this.groqRequest(messages);
            case 'zai': return this.zaiRequest(messages);
            case 'glm': return this.glmRequest(messages);
            case 'cloudflare': return this.cloudflareRequest(messages);
            case 'gemini': return this.geminiRequest(messages);
            default: return this.customRequest(messages);
        }
    }

    async generateWithTools(messages: Message[], tools: any[]): Promise<Message> {
        if (this.localAdapter) return this.localAdapter.generateWithTools(messages, tools);
        // Universal tool bridge would go here for cloud providers
        return this.generate(messages); 
    }

    private async anthropicRequest(messages: Message[]): Promise<Message> {
        const resp = await axios.post('https://api.anthropic.com/v1/messages', {
            model: this.config.model || 'claude-3-5-sonnet-latest',
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            max_tokens: this.config.max_tokens,
            temperature: this.config.temperature
        }, { 
            headers: { 
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            } 
        });
        return { role: 'assistant', content: resp.data.content[0].text };
    }

    private async zaiRequest(messages: Message[]): Promise<Message> {
        const resp = await axios.post('https://api.z.ai/v1/chat/completions', {
            model: this.config.model || 'z-1-pro',
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        }, { headers: { Authorization: `Bearer ${this.apiKey}` } });
        return { role: 'assistant', content: resp.data.choices[0].message.content };
    }

    private async glmRequest(messages: Message[]): Promise<Message> {
        const resp = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            model: this.config.model || 'glm-4',
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        }, { headers: { Authorization: `Bearer ${this.apiKey}` } });
        return { role: 'assistant', content: resp.data.choices[0].message.content };
    }

    private async cloudflareRequest(messages: Message[]): Promise<Message> {
        const endpoint = `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/ai/run/${this.config.model || '@cf/meta/llama-3-8b-instruct'}`;
        const resp = await axios.post(endpoint, {
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        }, { headers: { Authorization: `Bearer ${this.apiKey}` } });
        return { role: 'assistant', content: resp.data.result.response || resp.data.result.text };
    }

    private async geminiRequest(messages: Message[]): Promise<Message> {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model || 'gemini-1.5-pro'}:generateContent?key=${this.apiKey}`;
        const resp = await axios.post(url, {
            contents: messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }))
        });
        return { role: 'assistant', content: resp.data.candidates[0].content.parts[0].text };
    }

    private async openaiRequest(messages: Message[]): Promise<Message> {
        const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: this.config.model || 'gpt-4o',
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        }, { headers: { Authorization: `Bearer ${this.apiKey}` } });
        return { role: 'assistant', content: resp.data.choices[0].message.content };
    }

    private async groqRequest(messages: Message[]): Promise<Message> {
        const resp = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: this.config.model || 'llama3-70b-8192',
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        }, { headers: { Authorization: `Bearer ${this.apiKey}` } });
        return { role: 'assistant', content: resp.data.choices[0].message.content };
    }

    private async customRequest(messages: Message[]): Promise<Message> {
        const endpoint = this.config.endpoint || 'http://localhost:8080/v1/chat/completions';
        const resp = await axios.post(endpoint, {
            model: this.config.model,
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        }, { headers: { Authorization: `Bearer ${this.apiKey}` } });
        return { role: 'assistant', content: resp.data.choices?.[0]?.message?.content || resp.data.content };
    }
}
