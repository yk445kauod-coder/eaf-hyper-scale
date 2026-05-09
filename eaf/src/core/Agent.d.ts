import { LLMAdapter } from '../adapters/LLMAdapter.js';
import { Tool } from './Tool.js';
export declare class Agent {
    private llm;
    private tools;
    private history;
    private systemPrompt;
    constructor(llm: LLMAdapter, systemPrompt?: string);
    addTool(tool: Tool): void;
    run(userInput: string): Promise<string>;
}
//# sourceMappingURL=Agent.d.ts.map