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
export declare abstract class Tool {
    abstract definition: ToolDefinition;
    abstract execute(args: any): Promise<string>;
}
//# sourceMappingURL=Tool.d.ts.map