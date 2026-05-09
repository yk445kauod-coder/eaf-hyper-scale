import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMAdapter, Message } from './LLMAdapter.js';

export class GeminiAdapter extends LLMAdapter {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string, modelName: string = "gemini-2.0-flash") {
        super();
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    private convertToGeminiMessages(messages: Message[]) {
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
        const lastMessage = messages[messages.length - 1].content;
        return { history, lastMessage };
    }

    async generate(messages: Message[]): Promise<Message> {
        const { history, lastMessage } = this.convertToGeminiMessages(messages);
        const chat = this.model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        return { role: 'assistant', content: result.response.text() };
    }

    async generateWithTools(messages: Message[], tools: any[]): Promise<Message> {
        const geminiTools = tools.map(t => ({
            functionDeclarations: [t.function]
        }));

        const { history, lastMessage } = this.convertToGeminiMessages(messages);
        const chat = this.model.startChat({ 
            history,
            tools: geminiTools
        });

        const result = await chat.sendMessage(lastMessage);
        const response = result.response;
        const candidate = response.candidates![0];
        const content = candidate.content;

        const toolCalls = content.parts
            .filter((p: any) => p.functionCall)
            .map((p: any) => ({
                function: {
                    name: p.functionCall!.name,
                    arguments: p.functionCall!.args
                }
            }));

        return {
            role: 'assistant',
            content: response.text() || '',
            tool_calls: toolCalls.length > 0 ? toolCalls : undefined
        };
    }
}
