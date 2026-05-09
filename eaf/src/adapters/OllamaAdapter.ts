import ollama from 'ollama';
import { LLMAdapter, Message } from './LLMAdapter.js';

/**
 * Local Model Adapter for EAF 2.0
 * Supports Ollama and GGUF models with high-performance local inference.
 */
export class OllamaAdapter extends LLMAdapter {
    private model: string;

    constructor(model: string = 'llama3') {
        super();
        this.model = model;
    }

    async generate(messages: Message[]): Promise<Message> {
        const response = await ollama.chat({
            model: this.model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
        });
        return { role: 'assistant', content: response.message.content };
    }

    async generateWithTools(messages: Message[], tools: any[]): Promise<Message> {
        // Advanced tool-calling for local models via prompt injection or native function calling
        const response = await ollama.chat({
            model: this.model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            tools: tools // Supported in newer Ollama versions
        });

        const toolCalls = response.message.tool_calls?.map((tc: any) => ({
            id: tc.id || `call_${Math.random().toString(36).substr(2, 9)}`,
            function: {
                name: tc.function.name,
                arguments: tc.function.arguments
            }
        }));

        return {
            role: 'assistant',
            content: response.message.content || '',
            tool_calls: toolCalls
        };
    }
}
