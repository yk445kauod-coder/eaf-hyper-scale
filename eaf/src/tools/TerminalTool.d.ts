import { Tool, ToolDefinition } from '../core/Tool.js';
export declare class TerminalTool extends Tool {
    definition: ToolDefinition;
    execute(args: {
        command: string;
    }): Promise<string>;
}
//# sourceMappingURL=TerminalTool.d.ts.map