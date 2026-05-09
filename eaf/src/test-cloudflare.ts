import { CloudflareAdapter } from './adapters/CloudflareAdapter.js';
import { Agent } from './core/Agent.js';
import { FileSystemTool } from './tools/FileSystemTool.js';

async function main() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "YOUR_ACCOUNT_ID";
    const apiToken = process.env.CLOUDFLARE_API_TOKEN || "YOUR_API_TOKEN";

    if (!accountId || !apiToken) {
        console.error('Cloudflare credentials not found');
        process.exit(1);
    }

    console.log('--- Testing EAF with Cloudflare ---');
    const adapter = new CloudflareAdapter(accountId, apiToken, "@cf/meta/llama-3-8b-instruct");
    const agent = new Agent(adapter, { name: 'Cloudflare-Tester' });
    
    agent.addTool(new FileSystemTool());

    const result = await agent.run('Please create a file named "cloudflare-test.txt" with the content "EAF is working with Cloudflare!" and then read it back to confirm.');
    console.log('Result:', result);
}

main().catch(console.error);
