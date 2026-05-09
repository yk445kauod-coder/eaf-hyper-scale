import { LLMAdapter, Message } from './LLMAdapter.js';
export declare class OllamaAdapter extends LLMAdapter {
    private model;
    constructor(model?: string);
    generate(messages: Message[]): Promise<Message>;
    generateWithTools(messages: Message[], tools: any[]): Promise<Message>;
}
//# sourceMappingURL=OllamaAdapter.d.ts.map