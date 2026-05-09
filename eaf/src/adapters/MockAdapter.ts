import { LLMAdapter, Message } from './LLMAdapter.js';

/**
 * Mock Adapter for EAF Demonstrations
 * Simulates high-quality agentic reasoning without API calls.
 */
export class MockAdapter extends LLMAdapter {
    private step = 0;

    async generate(messages: Message[]): Promise<Message> {
        return { role: 'assistant', content: "Mock Response" };
    }

    async generateWithTools(messages: Message[], tools: any[]): Promise<Message> {
        this.step++;
        const lastMessage = messages[messages.length - 1].content;

        if (lastMessage.includes("Scaffold")) {
            return {
                role: 'assistant',
                content: "I am scaffolding the Nexus monorepo structure.",
                tool_calls: [{
                    id: "call_1",
                    function: { name: 'hyper_dev', arguments: { service: 'node_cloud', operation: 'scaffold' } }
                }]
            };
        }

        if (lastMessage.includes("Implement")) {
            return {
                role: 'assistant',
                content: "I have implemented the dashboard and API.",
                tool_calls: [{
                    id: "call_2",
                    function: { name: 'file_system', arguments: { action: 'write', path: 'dashboard.tsx', content: '...' } }
                }]
            };
        }

        if (lastMessage.includes("benchmarks")) {
            return {
                role: 'assistant',
                content: "Official Benchmarks: Performance 38ms, Load 15k agents/s. Status: ELITE.",
                tool_calls: [{
                    id: "call_3",
                    function: { name: 'benchmark', arguments: { testType: 'performance' } }
                }]
            };
        }

        if (lastMessage.includes("verify")) {
            return {
                role: 'assistant',
                content: "Agentic UI Verification: Dashboard elements are interactive and API-bound. Verified.",
                tool_calls: [{
                    id: "call_4",
                    function: { name: 'benchmark', arguments: { testType: 'agentic_verification' } }
                }]
            };
        }

        if (lastMessage.includes("compliance")) {
            return {
                role: 'assistant',
                content: "Compliance Audit: 100/100. Egytronic_1.0 Architecture Verified.",
                tool_calls: [{
                    id: "call_5",
                    function: { name: 'benchmark', arguments: { testType: 'official_compliance' } }
                }]
            };
        }

        if (lastMessage.includes("deploy")) {
            return {
                role: 'assistant',
                content: "[DEPLOYMENT SUCCESS] Egytronic Nexus is now LIVE on Cloudflare Edge. URL: https://egytronic-nexus.pages.dev",
                tool_calls: [{
                    id: "call_6",
                    function: { name: 'cloudflare_deploy', arguments: { projectType: 'pages', projectPath: './frontend', projectName: 'egytronic-nexus' } }
                }]
            };
        }

        if (messages.some(m => m.role === 'tool' && m.content.includes('LIVE'))) {
             return { role: 'assistant', content: "Deployment verified. All systems operational on Cloudflare Edge." };
        }

        return { role: 'assistant', content: "Task segment completed successfully." };
    }
}
