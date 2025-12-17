#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createParseCommand, createTestCommand } from './commands/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const program = new Command();
program
    .name('pdftokiao')
    .description('PDF to Kiao Parser - Convert PDF materials to Kiao import format')
    .version(packageJson.version);
program.addCommand(createParseCommand());
program.addCommand(createTestCommand());
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map