import { LLMAdapter } from '../adapters/LLMAdapter.js';
import { Tool } from './Tool.js';
import { Skill } from './Skill.js';
import chalk from 'chalk';

/**
 * Hyper-Scale Agent Orchestrator
 * Central intelligence of the Egytronic Agents Framework (EAF).
 */
export class Agent {
    llm;
    tools = new Map();
    skills = new Map();
    history = [];
    systemPrompt;
    options;

    constructor(llm, options = {}) {
        this.llm = llm;
        this.options = {
            name: 'Egytronic-Pro',
            verbose: true,
            maxIterations: 15,
            ...options
        };
        this.systemPrompt = options.systemPrompt || `
You are the Egytronic_1.0 master agent, built on the Hyper-Scale EAF framework.
You have autonomous control over file systems, browsers, cloud runtimes, and physical devices.
Your goal is to complete complex developer tasks with precision and efficiency.
Always prioritize clean architecture and industrial-grade security.
`;
        this.history.push({ role: 'system', content: this.systemPrompt });
    }

    addTool(tool) {
        this.tools.set(tool.definition.function.name, tool);
    }

    addSkill(skill) {
        this.skills.set(skill.name, skill);
    }

    log(message, color = chalk.cyan) {
        if (this.options.verbose) {
            console.log(color(`[${this.options.name}] ${message}`));
        }
    }

    async run(userInput) {
        this.history.push({ role: 'user', content: userInput });
        this.log(`Initiating task: ${userInput}`, chalk.yellow);

        let iterations = 0;
        while (iterations < this.options.maxIterations) {
            iterations++;
            const toolDefinitions = Array.from(this.tools.values()).map(t => t.definition);
            
            this.log(`Thinking (Iteration ${iterations})...`, chalk.gray);
            const response = await this.llm.generateWithTools(this.history, toolDefinitions);
            this.history.push(response);

            if (!response.tool_calls || response.tool_calls.length === 0) {
                this.log("Task Completed.", chalk.green);
                return response.content;
            }

            for (const toolCall of response.tool_calls) {
                const tool = this.tools.get(toolCall.function.name);
                if (tool) {
                    this.log(`Executing Tool: ${toolCall.function.name}`, chalk.magenta);
                    try {
                        const result = await tool.execute(toolCall.function.arguments);
                        this.history.push({
                            role: 'tool',
                            content: result,
                            tool_call_id: toolCall.id
                        });
                    } catch (e) {
                        this.history.push({
                            role: 'tool',
                            content: `Error executing tool: ${e.message}`,
                            tool_call_id: toolCall.id
                        });
                    }
                }
            }
        }
        return "Max iterations reached. Task partially completed.";
    }
}
