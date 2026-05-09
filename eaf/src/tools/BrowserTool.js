import { chromium, Browser, Page } from 'playwright';
import { Tool, ToolDefinition } from '../core/Tool.js';
export class BrowserTool extends Tool {
    browser = null;
    page = null;
    definition = {
        type: 'function',
        function: {
            name: 'browser',
            description: 'Navigate the web, search, and extract information.',
            parameters: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        enum: ['navigate', 'click', 'type', 'search', 'screenshot', 'extract'],
                        description: 'The browser action to perform.'
                    },
                    url: {
                        type: 'string',
                        description: 'URL to navigate to.'
                    },
                    selector: {
                        type: 'string',
                        description: 'CSS selector for click or type.'
                    },
                    text: {
                        type: 'string',
                        description: 'Text to type or search query.'
                    }
                },
                required: ['action']
            }
        }
    };
    async ensureBrowser() {
        if (!this.browser) {
            this.browser = await chromium.launch({ headless: true });
            this.page = await this.browser.newPage();
        }
    }
    async execute(args) {
        try {
            await this.ensureBrowser();
            if (!this.page)
                return 'Error: Page not initialized.';
            switch (args.action) {
                case 'navigate':
                    await this.page.goto(args.url || 'https://www.google.com');
                    return `Navigated to ${args.url}`;
                case 'click':
                    await this.page.click(args.selector || '');
                    return `Clicked ${args.selector}`;
                case 'type':
                    await this.page.fill(args.selector || '', args.text || '');
                    return `Typed "${args.text}" into ${args.selector}`;
                case 'search':
                    await this.page.goto(`https://www.google.com/search?q=${encodeURIComponent(args.text || '')}`);
                    return `Searching for "${args.text}"`;
                case 'screenshot':
                    const path = `screenshot-${Date.now()}.png`;
                    await this.page.screenshot({ path });
                    return `Screenshot saved as ${path}`;
                case 'extract':
                    const content = await this.page.innerText('body');
                    return content.substring(0, 1000) + '...';
                default:
                    return `Unknown action: ${args.action}`;
            }
        }
        catch (error) {
            return `Error: ${error.message}. Make sure playwright browsers are installed (npx playwright install chromium).`;
        }
    }
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}
//# sourceMappingURL=BrowserTool.js.map