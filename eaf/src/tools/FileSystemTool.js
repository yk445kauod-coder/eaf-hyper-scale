import fs from 'fs/promises';
import path from 'path';
import { Tool, ToolDefinition } from '../core/Tool.js';
export class FileSystemTool extends Tool {
    definition = {
        type: 'function',
        function: {
            name: 'file_system',
            description: 'Perform file system operations like read, write, list, and delete.',
            parameters: {
                type: 'object',
                properties: {
                    operation: {
                        type: 'string',
                        enum: ['read', 'write', 'list', 'delete', 'mkdir'],
                        description: 'The operation to perform.'
                    },
                    path: {
                        type: 'string',
                        description: 'The file or directory path.'
                    },
                    content: {
                        type: 'string',
                        description: 'The content to write (for write operation).'
                    }
                },
                required: ['operation', 'path']
            }
        }
    };
    async execute(args) {
        try {
            switch (args.operation) {
                case 'read':
                    return await fs.readFile(args.path, 'utf-8');
                case 'write':
                    await fs.writeFile(args.path, args.content || '');
                    return `Successfully wrote to ${args.path}`;
                case 'list':
                    const files = await fs.readdir(args.path);
                    return files.join('\n');
                case 'delete':
                    await fs.rm(args.path, { recursive: true, force: true });
                    return `Successfully deleted ${args.path}`;
                case 'mkdir':
                    await fs.mkdir(args.path, { recursive: true });
                    return `Successfully created directory ${args.path}`;
                default:
                    return `Unknown operation: ${args.operation}`;
            }
        }
        catch (error) {
            return `Error: ${error.message}`;
        }
    }
}
//# sourceMappingURL=FileSystemTool.js.map