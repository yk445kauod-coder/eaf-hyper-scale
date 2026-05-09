import { LLMAdapter, Message } from '../adapters/LLMAdapter.js';
import { Tool } from './Tool.js';
import { Skill } from './Skill.js';
import chalk from 'chalk';

export interface AgentOptions {
    name?: string;
    systemPrompt?: string;
    maxIterations?: number;
    verbose?: boolean;
    memory?: boolean;
}

export class Agent {
    public llm: LLMAdapter;
    public tools: Map<string, Tool> = new Map();
    public skills: Map<string, Skill> = new Map();
    public history: Message[] = [];
    public options: AgentOptions;
    
    private defaultSystemPrompt = `You are EAF (Egytronic Agents Framework), a high-performance autonomous agent framework developed by Egytronic.
Your goal is to assist the user by utilizing your extensive toolset and skills.
You are running on a multi-modal architecture capable of tool-calling, browser manipulation, and system interaction.
If you need to use a tool, respond with a valid "tool_calls" JSON object.
Maintain a professional and efficient persona.`;

    constructor(llm: LLMAdapter, options: AgentOptions = {}) {
        this.llm = llm;
        this.options = {
            name: 'Egytronic-Agent-1.0',
            maxIterations: 15,
            verbose: true,
            memory: true,
            ...options
        };
        
        const initialPrompt = options.systemPrompt || this.defaultSystemPrompt;
        this.history.push({ role: 'system', content: initialPrompt });
        this.updateSystemInstructions();
    }

    addTool(tool: Tool) {
        this.tools.set(tool.definition.function.name, tool);
        this.updateSystemInstructions();
        return this;
    }

    addSkill(skill: Skill) {
        this.skills.set(skill.name, skill);
        skill.tools.forEach(tool => this.tools.set(tool.definition.function.name, tool));
        this.updateSystemInstructions();
        return this;
    }

    private updateSystemInstructions() {
        const toolList = Array.from(this.tools.values())
            .map(t => `- ${t.definition.function.name}: ${t.definition.function.description}`)
            .join('\n');
            
        const skillList = Array.from(this.skills.values())
            .map(s => `- ${s.name}: ${s.description}`)
            .join('\n');
            
        const basePrompt = this.options.systemPrompt || this.defaultSystemPrompt;
        this.history[0].content = `${basePrompt}

## Available Skills:
${skillList || 'None'}

## Available Tools:
${toolList || 'None'}

## Interaction Guidelines:
1. Analyze the request.
2. If tools are needed, provide "tool_calls".
3. If no tools are needed, provide a text response.
4. If a task requires multiple steps, execute them sequentially.`;
    }

    async run(userInput: string): Promise<string> {
        this.history.push({ role: 'user', content: userInput });
        
        let iteration = 0;
        const maxIterations = this.options.maxIterations || 15;

        while (iteration < maxIterations) {
            iteration++;
            if (this.options.verbose) {
                console.log(chalk.magenta(`\n[${this.options.name}] Step ${iteration}...`));
            }

            const toolDefinitions = Array.from(this.tools.values()).map(t => t.definition);
            const response = await this.llm.generateWithTools(this.history, toolDefinitions);
            
            // Handle parsing for models without native tool call support
            if (!response.tool_calls || response.tool_calls.length === 0) {
                const toolCallRegex = /\{[\s\S]*?"tool_calls"[\s\S]*?\}/g;
                const matches = response.content.match(toolCallRegex);
                
                if (matches) {
                    response.tool_calls = [];
                    for (const match of matches) {
                        try {
                            const parsed = JSON.parse(match);
                            if (parsed.tool_calls && Array.isArray(parsed.tool_calls)) {
                                response.tool_calls.push(...parsed.tool_calls);
                            }
                        } catch (e) {}
                    }
                }
                
                // Final fallback: check for raw tool-like structures
                if (!response.tool_calls || response.tool_calls.length === 0) {
                     const rawToolRegex = /\{[\s\S]*?"name"[\s\S]*?"arguments"[\s\S]*?\}/g;
                     const rawMatches = response.content.match(rawToolRegex);
                     if (rawMatches) {
                         response.tool_calls = rawMatches.map(m => {
                             try {
                                 const p = JSON.parse(m);
                                 return {
                                     id: `call_${Math.random().toString(36).substring(7)}`,
                                     type: 'function',
                                     function: { name: p.name, arguments: p.arguments }
                                 };
                             } catch(e) { return null; }
                         }).filter(x => x !== null) as any;
                     }
                }
            }

            this.history.push(response);

            if (!response.tool_calls || response.tool_calls.length === 0) {
                if (this.options.verbose) console.log(chalk.green(`\n[${this.options.name}] Task Finished.`));
                return response.content;
            }

            for (const toolCall of response.tool_calls) {
                const toolName = toolCall.function.name;
                const toolArgs = toolCall.function.arguments;
                
                const tool = this.tools.get(toolName);
                if (tool) {
                    if (this.options.verbose) console.log(chalk.cyan(`[*] Executing: ${toolName}`));
                    try {
                        const result = await tool.execute(toolArgs);
                        this.history.push({
                            role: 'tool',
                            content: result,
                            // @ts-ignore
                            tool_call_id: toolCall.id || `call_${Math.random().toString(36).substring(7)}`
                        });
                    } catch (error: any) {
                        const errorMsg = `Execution error: ${error.message}`;
                        this.history.push({
                            role: 'tool',
                            content: errorMsg,
                            // @ts-ignore
                            tool_call_id: toolCall.id
                        });
                    }
                } else {
                    this.history.push({
                        role: 'tool',
                        content: `Error: Tool ${toolName} not found.`,
                        // @ts-ignore
                        tool_call_id: toolCall.id
                    });
                }
            }
        }

        return "Maximum iteration limit reached.";
    }
}
