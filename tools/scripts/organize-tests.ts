#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { program } from 'commander';
import ora from 'ora';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
program
  .name('organize-tests')
  .description('Organize test files into a structured directory layout')
  .option('-d, --dry-run', 'Show what would be done without making changes')
  .option('-v, --verbose', 'Show detailed output')
  .parse(process.argv);

const options = program.opts();
const dryRun = options.dryRun || false;
const verbose = options.verbose || false;

// Define the target structure
const TARGET_STRUCTURE = {
  // Config files
  'config/jest': ['__tests__/config/jest/*'],
  'config/playwright': ['__tests__/config/playwright/*'],
  
  // Test utilities
  'utils': [
    '__tests__/setup/*',
    '__tests__/setupTests.ts',
    '__tests__/test-utils.tsx',
    '__tests__/test-context.tsx',
    '__tests__/providers.tsx',
  ],
  
  // Mocks
  'mocks': ['__tests__/mocks/*'],
  
  // Fixtures
  'fixtures': ['__tests__/fixtures/*.json'],
  
  // Test files
  'unit': ['__tests__/unit/*'],
  'integration': ['__tests__/integration/*'],
  'e2e': [
    '__tests__/e2e/*',
    '__tests__/landing-page*.spec.ts',
  ],
} as const;

/**
 * Ensure a directory exists, create it if it doesn't
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    if (verbose) {
      console.log(chalk.gray(`Created directory: ${dirPath}`));
    }
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Move files according to the target structure
 */
async function organizeTestFiles(): Promise<void> {
  const rootDir = path.join(process.cwd(), '__tests__');
  const operations: Array<{ from: string; to: string }> = [];

  // Collect all operations
  for (const [targetDir, patterns] of Object.entries(TARGET_STRUCTURE)) {
    const targetPath = path.join(rootDir, targetDir);
    
    for (const pattern of patterns) {
      const matches = await glob(pattern, { cwd: rootDir, absolute: true });
      
      for (const sourcePath of matches) {
        const relativePath = path.relative(rootDir, sourcePath);
        const fileName = path.basename(relativePath);
        const destPath = path.join(targetPath, fileName);
        
        operations.push({
          from: sourcePath,
          to: destPath,
        });
      }
    }
  }

  // Execute operations
  const spinner = ora('Organizing test files...').start();
  
  try {
    for (const { from, to } of operations) {
      if (dryRun) {
        console.log(chalk.blue(`[DRY RUN] Would move ${from} to ${to}`));
        continue;
      }

      await ensureDirectoryExists(path.dirname(to));
      
      if (verbose) {
        console.log(chalk.gray(`Moving ${from} to ${to}`));
      }
      
      await fs.rename(from, to);
    }
    
    // Clean up empty directories
    await removeEmptyDirectories(rootDir);
    
    spinner.succeed('Successfully organized test files');
  } catch (error) {
    spinner.fail('Failed to organize test files');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

/**
 * Recursively remove empty directories
 */
async function removeEmptyDirectories(directory: string): Promise<void> {
  let entries: string[] = [];
  
  try {
    entries = await fs.readdir(directory, { withFileTypes: true })
      .then(dirents => dirents.filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(directory, dirent.name)));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return;
  }

  // Process subdirectories first
  for (const entry of entries) {
    await removeEmptyDirectories(entry);
  }

  // Check if directory is empty
  try {
    const remaining = await fs.readdir(directory);
    if (remaining.length === 0) {
      if (verbose) {
        console.log(chalk.gray(`Removing empty directory: ${directory}`));
      }
      if (!dryRun) {
        await fs.rmdir(directory);
      }
    }
  } catch (error) {
    // Directory might have been removed by another operation
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

// Main function
async function main() {
  console.log(chalk.blue('\n=== Test File Organizer ===\n'));
  
  if (dryRun) {
    console.log(chalk.yellow('Dry run mode: No files will be modified\n'));
  }
  
  try {
    await organizeTestFiles();
    console.log(chalk.green('\nDone!\n'));
  } catch (error) {
    console.error(chalk.red('\nError:'), error);
    process.exit(1);
  }
}

// Run the script
main();
