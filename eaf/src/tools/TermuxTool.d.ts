import { Tool, ToolDefinition } from '../core/Tool.js';
export declare class TermuxTool extends Tool {
    definition: ToolDefinition;
    execute(args: {
        action: string;
        text?: string;
    }): Promise<string>;
}
//# sourceMappingURL=TermuxTool.d.ts.map