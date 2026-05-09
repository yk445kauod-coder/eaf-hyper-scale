import { Tool, ToolDefinition } from '../core/Tool.js';
export declare class FileSystemTool extends Tool {
    definition: ToolDefinition;
    execute(args: {
        operation: string;
        path: string;
        content?: string;
    }): Promise<string>;
}
//# sourceMappingURL=FileSystemTool.d.ts.map