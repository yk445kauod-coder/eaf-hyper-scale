import { GeminiAdapter } from './adapters/GeminiAdapter.js';
import { Agent } from './core/Agent.js';
import { FileSystemTool } from './tools/FileSystemTool.js';
import fs from 'fs';

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not found in environment');
        process.exit(1);
    }

    console.log('--- Testing EAF with Gemini ---');
    const adapter = new GeminiAdapter(apiKey, 'gemini-1.5-flash');
    const agent = new Agent(adapter, { name: 'Gemini-Tester' });
    
    agent.addTool(new FileSystemTool());

    const result = await agent.run('Please create a file named "gemini-test.txt" with the content "EAF is working with Gemini!" and then read it back to confirm.');
    console.log('Result:', result);
}

main().catch(console.error);
