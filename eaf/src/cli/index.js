import { Command } from 'commander';
import readline from 'readline';
import chalk from 'chalk';
import { EAF_SPLASH, PIXEL_BORDER } from './ui/ascii-art.js';
import { Agent } from '../core/Agent.js';
import { OllamaAdapter } from '../adapters/OllamaAdapter.js';
import { FileSystemTool } from '../tools/FileSystemTool.js';
import { TerminalTool } from '../tools/TerminalTool.js';
import { TermuxTool } from '../tools/TermuxTool.js';
import { BrowserTool } from '../tools/BrowserTool.js';
const program = new Command();
program
    .name('eaf')
    .description('Egytronic Agents Framework CLI')
    .version('1.0.0')
    .option('-m, --model <model>', 'Ollama model to use', 'llama3')
    .action(async (options) => {
    console.log(EAF_SPLASH);
    console.log(PIXEL_BORDER);
    console.log(`[*] Initializing EAF with model: ${chalk.green(options.model)}`);
    const llm = new OllamaAdapter(options.model);
    const agent = new Agent(llm);
    // Register tools
    agent.addTool(new FileSystemTool());
    agent.addTool(new TerminalTool());
    agent.addTool(new TermuxTool());
    agent.addTool(new BrowserTool());
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.cyan('eaf> ')
    });
    console.log(`[*] Systems online. How can I help you today?`);
    rl.prompt();
    rl.on('line', async (line) => {
        const input = line.trim();
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            rl.close();
            return;
        }
        if (input) {
            try {
                const response = await agent.run(input);
                console.log(`\n${chalk.green('EAF:')} ${response}\n`);
            }
            catch (error) {
                console.error(chalk.red(`\n[!] Error: ${error.message}\n`));
            }
        }
        rl.prompt();
    }).on('close', () => {
        console.log(chalk.yellow('\n[*] EAF shutting down. Goodbye!'));
        process.exit(0);
    });
});
program.parse();
//# sourceMappingURL=index.js.map