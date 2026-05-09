import ollama from 'ollama';
import { LLMAdapter, Message } from './LLMAdapter.js';
export class OllamaAdapter extends LLMAdapter {
    model;
    constructor(model = 'llama3') {
        super();
        this.model = model;
    }
    async generate(messages) {
        const response = await ollama.chat({
            model: this.model,
            messages: messages,
        });
        return response.message;
    }
    async generateWithTools(messages, tools) {
        const response = await ollama.chat({
            model: this.model,
            messages: messages,
            tools: tools,
        });
        return response.message;
    }
}
//# sourceMappingURL=OllamaAdapter.js.map