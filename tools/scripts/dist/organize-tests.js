#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const ora_1 = __importDefault(require("ora"));
// Get the directory name in ES module
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
// Parse command line arguments
commander_1.program
    .name('organize-tests')
    .description('Organize test files into a structured directory layout')
    .option('-d, --dry-run', 'Show what would be done without making changes')
    .option('-v, --verbose', 'Show detailed output')
    .parse(process.argv);
const options = commander_1.program.opts();
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
};
/**
 * Ensure a directory exists, create it if it doesn't
 */
async function ensureDirectoryExists(dirPath) {
    try {
        await promises_1.default.mkdir(dirPath, { recursive: true });
        if (verbose) {
            console.log(chalk_1.default.gray(`Created directory: ${dirPath}`));
        }
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}
/**
 * Move files according to the target structure
 */
async function organizeTestFiles() {
    const rootDir = path_1.default.join(process.cwd(), '__tests__');
    const operations = [];
    // Collect all operations
    for (const [targetDir, patterns] of Object.entries(TARGET_STRUCTURE)) {
        const targetPath = path_1.default.join(rootDir, targetDir);
        for (const pattern of patterns) {
            const matches = await glob(pattern, { cwd: rootDir, absolute: true });
            for (const sourcePath of matches) {
                const relativePath = path_1.default.relative(rootDir, sourcePath);
                const fileName = path_1.default.basename(relativePath);
                const destPath = path_1.default.join(targetPath, fileName);
                operations.push({
                    from: sourcePath,
                    to: destPath,
                });
            }
        }
    }
    // Execute operations
    const spinner = (0, ora_1.default)('Organizing test files...').start();
    try {
        for (const { from, to } of operations) {
            if (dryRun) {
                console.log(chalk_1.default.blue(`[DRY RUN] Would move ${from} to ${to}`));
                continue;
            }
            await ensureDirectoryExists(path_1.default.dirname(to));
            if (verbose) {
                console.log(chalk_1.default.gray(`Moving ${from} to ${to}`));
            }
            await promises_1.default.rename(from, to);
        }
        // Clean up empty directories
        await removeEmptyDirectories(rootDir);
        spinner.succeed('Successfully organized test files');
    }
    catch (error) {
        spinner.fail('Failed to organize test files');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
/**
 * Recursively remove empty directories
 */
async function removeEmptyDirectories(directory) {
    let entries = [];
    try {
        entries = await promises_1.default.readdir(directory, { withFileTypes: true })
            .then(dirents => dirents.filter(dirent => dirent.isDirectory())
            .map(dirent => path_1.default.join(directory, dirent.name)));
    }
    catch (error) {
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
        const remaining = await promises_1.default.readdir(directory);
        if (remaining.length === 0) {
            if (verbose) {
                console.log(chalk_1.default.gray(`Removing empty directory: ${directory}`));
            }
            if (!dryRun) {
                await promises_1.default.rmdir(directory);
            }
        }
    }
    catch (error) {
        // Directory might have been removed by another operation
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}
// Main function
async function main() {
    console.log(chalk_1.default.blue('\n=== Test File Organizer ===\n'));
    if (dryRun) {
        console.log(chalk_1.default.yellow('Dry run mode: No files will be modified\n'));
    }
    try {
        await organizeTestFiles();
        console.log(chalk_1.default.green('\nDone!\n'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\nError:'), error);
        process.exit(1);
    }
}
// Run the script
main();
//# sourceMappingURL=organize-tests.js.map