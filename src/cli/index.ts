#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createParseCommand, createTestCommand } from './commands/index.js';

// Get package.json for version info
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Create main program
const program = new Command();

program
  .name('pdftokiao')
  .description('PDF to Kiao Parser - Convert PDF materials to Kiao import format')
  .version(packageJson.version);

// Add commands
program.addCommand(createParseCommand());
program.addCommand(createTestCommand());

// Parse arguments and execute
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
