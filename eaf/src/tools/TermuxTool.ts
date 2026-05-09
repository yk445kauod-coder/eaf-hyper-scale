import { exec } from 'child_process';
import { promisify } from 'util';
import { Tool, ToolDefinition } from '../core/Tool.js';

const execAsync = promisify(exec);

export class TermuxTool extends Tool {
    definition: ToolDefinition = {
        type: 'function',
        function: {
            name: 'termux',
            description: 'Interact with Android features via termux-api.',
            parameters: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        enum: ['vibrate', 'battery-status', 'toast', 'notification', 'clipboard-get', 'clipboard-set'],
                        description: 'The termux-api action to perform.'
                    },
                    text: {
                        type: 'string',
                        description: 'Text for toast, notification, or clipboard-set.'
                    }
                },
                required: ['action']
            }
        }
    };

    async execute(args: { action: string; text?: string }): Promise<string> {
        let command = '';
        switch (args.action) {
            case 'vibrate':
                command = 'termux-vibrate';
                break;
            case 'battery-status':
                command = 'termux-battery-status';
                break;
            case 'toast':
                command = `termux-toast "${args.text || ''}"`;
                break;
            case 'notification':
                command = `termux-notification --content "${args.text || ''}"`;
                break;
            case 'clipboard-get':
                command = 'termux-clipboard-get';
                break;
            case 'clipboard-set':
                command = `termux-clipboard-set "${args.text || ''}"`;
                break;
            default:
                return `Unknown action: ${args.action}`;
        }

        try {
            const { stdout, stderr } = await execAsync(command);
            return stdout || stderr || `Successfully executed ${args.action}`;
        } catch (error: any) {
            return `Error: ${error.message}. Make sure termux-api is installed.`;
        }
    }
}
