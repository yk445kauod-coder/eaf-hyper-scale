import { exec } from 'child_process';
import { promisify } from 'util';
import { Tool, ToolDefinition } from '../core/Tool.js';

const execAsync = promisify(exec);

export class TerminalTool extends Tool {
    definition: ToolDefinition = {
        type: 'function',
        function: {
            name: 'terminal',
            description: 'Execute shell commands in the local terminal.',
            parameters: {
                type: 'object',
                properties: {
                    command: {
                        type: 'string',
                        description: 'The shell command to execute.'
                    }
                },
                required: ['command']
            }
        }
    };

    async execute(args: { command: string }): Promise<string> {
        try {
            const { stdout, stderr } = await execAsync(args.command);
            return stdout || stderr || 'Command executed successfully (no output).';
        } catch (error: any) {
            return `Error: ${error.message}\n${error.stderr || ''}`;
        }
    }
}
