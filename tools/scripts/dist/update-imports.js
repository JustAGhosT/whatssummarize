"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const glob_1 = require("glob");
const chalk_1 = __importDefault(require("chalk"));
// Define the source directory and file patterns
const SRC_DIR = path_1.default.join(process.cwd(), 'apps/web/src');
const FILE_PATTERNS = ['**/*.{ts,tsx}'];
// Define the import mappings
const IMPORT_MAPPINGS = [
    {
        pattern: /^@\/components\/(.*)/,
        replacement: '@ui/$1',
        description: 'UI components'
    },
    {
        pattern: /^@\/lib\/(.*)/,
        replacement: '@utils/$1',
        description: 'Utility functions'
    },
    {
        pattern: /^@\/config\/(.*)/,
        replacement: '@config/$1',
        description: 'Configuration'
    },
    // Add more mappings as needed
];
// Function to update imports in a file
async function updateImportsInFile(filePath) {
    try {
        let content = await fs_1.default.promises.readFile(filePath, 'utf-8');
        let updated = false;
        let changes = [];
        // Process each import mapping
        for (const { pattern, replacement, description } of IMPORT_MAPPINGS) {
            const regex = new RegExp(`(import\s+(?:{[^}]*}\s+from\s+['"])|import\s+[^'"\s]+\s+from\s+['"]|from\s+['"])${pattern.source}(['"])`, 'g');
            const newContent = content.replace(regex, (match, prefix, pathMatch, quote) => {
                const newPath = pathMatch.replace(pattern, replacement);
                if (newPath !== pathMatch) {
                    updated = true;
                    changes.push(`  - ${pathMatch} → ${newPath} (${description})`);
                    return `${prefix}${newPath}${quote}`;
                }
                return match;
            });
            if (newContent !== content) {
                content = newContent;
            }
        }
        // Write the updated content back to the file if changes were made
        if (updated) {
            await fs_1.default.promises.writeFile(filePath, content, 'utf-8');
            console.log(chalk_1.default.green(`\nUpdated imports in: ${path_1.default.relative(process.cwd(), filePath)}`));
            changes.forEach(change => console.log(change));
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error processing file ${filePath}:`), error);
        return false;
    }
}
// Main function to process all files
async function main() {
    console.log(chalk_1.default.blue('Starting import path updates...'));
    // Find all TypeScript/JavaScript files
    const files = await (0, glob_1.glob)(FILE_PATTERNS, {
        cwd: SRC_DIR,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
    });
    console.log(`Found ${files.length} files to process in ${SRC_DIR}`);
    let updatedCount = 0;
    // Process each file
    for (const file of files) {
        const wasUpdated = await updateImportsInFile(file);
        if (wasUpdated) {
            updatedCount++;
        }
    }
    console.log(chalk_1.default.green(`\n✅ Update complete!`));
    console.log(`- Processed ${files.length} files`);
    console.log(`- Updated ${updatedCount} files`);
    if (updatedCount > 0) {
        console.log('\nNext steps:');
        console.log('1. Review the changes using git diff');
        console.log('2. Run tests to ensure everything still works');
        console.log('3. Commit the changes');
    }
    else {
        console.log('No files needed updating.');
    }
}
// Run the script
main().catch(console.error);
//# sourceMappingURL=update-imports.js.map