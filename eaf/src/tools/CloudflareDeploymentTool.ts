import { exec } from 'child_process';
import { promisify } from 'util';
import { Tool, ToolDefinition } from '../core/Tool.js';

const execAsync = promisify(exec);

/**
 * Cloudflare Deployment Tool
 * Deploys EAF-built applications to Cloudflare Workers and Pages using Wrangler.
 * Part of the Egytronic Agents Framework (EAF).
 */
export class CloudflareDeploymentTool extends Tool {
    definition: ToolDefinition = {
        type: 'function',
        function: {
            name: 'cloudflare_deploy',
            description: 'Deploy applications to Cloudflare using Wrangler.',
            parameters: {
                type: 'object',
                properties: {
                    projectType: { 
                        type: 'string', 
                        enum: ['worker', 'pages'],
                        description: 'The type of Cloudflare project to deploy.'
                    },
                    projectPath: { type: 'string', description: 'Path to the project directory.' },
                    projectName: { type: 'string', description: 'Name of the project on Cloudflare.' }
                },
                required: ['projectType', 'projectPath']
            }
        }
    };

    async execute(args: { projectType: string; projectPath: string; projectName?: string }): Promise<string> {
        console.log(`[Cloudflare] Executing REAL deployment for ${args.projectType} at ${args.projectPath}...`);
        
        try {
            const command = args.projectType === 'worker' 
                ? `npx wrangler deploy` 
                : `npx wrangler pages deploy ${args.projectPath} --project-name ${args.projectName || 'egytronic-nexus'}`;

            console.log(`[Cloudflare] Running: ${command}`);
            const { stdout, stderr } = await execAsync(command, {
                env: {
                    ...process.env,
                    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || "cfut_2XYn98OEWFNZsQMgSSblbytvBdSzopcuew07taYi6aefc076",
                    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || "708d1cc2fd5a22a9e495dfe415c9f921"
                }
            });

            return `[SUCCESS] Cloudflare Deployment Output:\n${stdout || stderr}`;
        } catch (error: any) {
            console.error(`[Cloudflare Error] ${error.message}`);
            return `[ERROR] Cloudflare deployment failed: ${error.message}\n${error.stdout || ''}`;
        }
    }
}
