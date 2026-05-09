import { Skill } from '../core/Skill.js';
import { BrowserTool } from '../tools/BrowserTool.js';
import { FileSystemTool } from '../tools/FileSystemTool.js';

export class WebResearcherSkill extends Skill {
    name = 'web_researcher';
    description = 'Skill to browse the web, extract data, and save it to the file system.';
    public tools = [new BrowserTool(), new FileSystemTool()];

    async execute(agent: any, input: string): Promise<string> {
        console.log(`[WebResearcher] Researching: ${input}`);
        return `Deep research result for: ${input}`;
    }
}
