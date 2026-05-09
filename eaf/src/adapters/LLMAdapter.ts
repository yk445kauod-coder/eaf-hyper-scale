export interface Message {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    tool_calls?: any[];
}

export abstract class LLMAdapter {
    abstract generate(messages: Message[]): Promise<Message>;
    abstract generateWithTools(messages: Message[], tools: any[]): Promise<Message>;
}
