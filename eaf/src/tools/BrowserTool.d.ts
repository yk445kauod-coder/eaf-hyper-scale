import { Tool, ToolDefinition } from '../core/Tool.js';
export declare class BrowserTool extends Tool {
    private browser;
    private page;
    definition: ToolDefinition;
    private ensureBrowser;
    execute(args: {
        action: string;
        url?: string;
        selector?: string;
        text?: string;
    }): Promise<string>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=BrowserTool.d.ts.map