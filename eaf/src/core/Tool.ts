import { Message } from '../adapters/LLMAdapter.js';

export interface ToolDefinition {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, any>;
            required: string[];
        };
    };
}

export abstract class Tool {
    abstract definition: ToolDefinition;
    abstract execute(args: any): Promise<string>;
}
