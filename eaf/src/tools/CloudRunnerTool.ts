import { Tool, ToolDefinition } from '../core/Tool.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class CloudRunnerTool extends Tool {
    definition: ToolDefinition = {
        type: 'function',
        function: {
            name: 'cloud_runner',
            description: 'Execute code (Node.js/Python) in a cloud-based environment.',
            parameters: {
                type: 'object',
                properties: {
                    language: {
                        type: 'string',
                        enum: ['nodejs', 'python'],
                        description: 'The programming language.'
                    },
                    code: {
                        type: 'string',
                        description: 'The source code to execute.'
                    }
                },
                required: ['language', 'code']
            }
        }
    };

    async execute(args: { language: string; code: string }): Promise<string> {
        // In a real scenario, this would call an external API (like Piston or a Lambda)
        // Here we simulate it locally for demonstration
        try {
            const command = args.language === 'nodejs' ? `node -e "${args.code.replace(/"/g, '\\"')}"` : `python3 -c "${args.code.replace(/"/g, '\\"')}"`;
            const { stdout, stderr } = await execAsync(command);
            return stdout || stderr || 'Executed successfully.';
        } catch (error: any) {
            return `Execution error: ${error.message}`;
        }
    }
}
