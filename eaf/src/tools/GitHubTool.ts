import { exec } from 'child_process';
import { promisify } from 'util';
import { Tool, ToolDefinition } from '../core/Tool.js';

const execAsync = promisify(exec);

export class GitHubTool extends Tool {
    definition: ToolDefinition = {
        type: 'function',
        function: {
            name: 'github',
            description: 'Interact with GitHub repositories (clone, push, pull, status).',
            parameters: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        enum: ['clone', 'push', 'pull', 'status', 'commit'],
                        description: 'The git action to perform.'
                    },
                    repoUrl: {
                        type: 'string',
                        description: 'Repository URL for clone.'
                    },
                    message: {
                        type: 'string',
                        description: 'Commit message.'
                    }
                },
                required: ['action']
            }
        }
    };

    async execute(args: { action: string; repoUrl?: string; message?: string }): Promise<string> {
        let command = '';
        switch (args.action) {
            case 'clone':
                command = `git clone ${args.repoUrl}`;
                break;
            case 'push':
                command = `git push`;
                break;
            case 'pull':
                command = `git pull`;
                break;
            case 'status':
                command = `git status`;
                break;
            case 'commit':
                command = `git add . && git commit -m "${args.message || 'Auto-commit from EAF'}"`;
                break;
            default:
                return `Unknown action: ${args.action}`;
        }

        try {
            const { stdout, stderr } = await execAsync(command);
            return stdout || stderr || `Successfully executed git ${args.action}`;
        } catch (error: any) {
            return `Error: ${error.message}`;
        }
    }
}
