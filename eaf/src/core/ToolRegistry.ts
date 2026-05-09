import { Tool } from '../core/Tool.js';

export class ToolRegistry {
    private static instance: ToolRegistry;
    private tools: Map<string, Tool> = new Map();

    private constructor() {}

    static getInstance() {
        if (!this.instance) this.instance = new ToolRegistry();
        return this.instance;
    }

    register(tool: Tool) {
        this.tools.set(tool.definition.function.name, tool);
    }

    getTool(name: string) {
        return this.tools.get(name);
    }

    getAllTools() {
        return Array.from(this.tools.values());
    }

    async loadFromMCP(serverUrl: string) {
        // Logik zur dynamischen Entdeckung von Tools über MCP
        console.log(`Discovering tools from MCP: ${serverUrl}...`);
    }
}
