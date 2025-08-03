#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the source directory and file patterns
const SRC_DIR = path.join(process.cwd(), '..', '..', 'apps', 'web', 'src');
const FILE_PATTERNS = ['**/*.{ts,tsx}'];

// Define the import mappings
const IMPORT_MAPPINGS = [
  { 
    pattern: /^@\/components\/ui\/(.*)/, 
    replacement: '@ui/components/$1',
    description: 'UI components'
  },
  { 
    pattern: /^@\/lib\/(.*)/, 
    replacement: '@utils/$1',
    description: 'Utility functions'
  },
  { 
    pattern: /^@\/types\/(.*)/, 
    replacement: '@types/$1',
    description: 'Type definitions'
  },
  { 
    pattern: /^@\/contexts\/(.*)/, 
    replacement: '@contexts/$1',
    description: 'Context providers'
  },
  { 
    pattern: /^@\/hooks\/(.*)/, 
    replacement: '@hooks/$1',
    description: 'Custom hooks'
  },
  { 
    pattern: /^@\/data\/(.*)/, 
    replacement: '@data/$1',
    description: 'Data and mocks'
  }
];

// Function to update imports in a file
async function updateImportsInFile(filePath) {
  try {
    let content = await fs.promises.readFile(filePath, 'utf-8');
    let updated = false;
    let changes = [];

    // Process each import mapping
    for (const { pattern, replacement, description } of IMPORT_MAPPINGS) {
      // Handle different import styles:
      // 1. import x from '@/path'
      // 2. import { x } from '@/path'
      // 3. from '@/path'
      const importPatterns = [
        // import x from '@/path'
        `(import\\s+[^'"\s]+\\s+from\\s+['\"])${pattern.source}(['\"])`,
        // import { x } from '@/path'
        `(import\\s*\\{[^}]*\\}\\s+from\\s+['\"])${pattern.source}(['\"])`,
        // from '@/path'
        `(from\\s+['\"])${pattern.source}(['\"])`
      ];

      for (const patternStr of importPatterns) {
        const regex = new RegExp(patternStr, 'g');
        
        const newContent = content.replace(regex, (match, prefix, quote) => {
          const newPath = path.relative(
            path.dirname(filePath),
            path.join(SRC_DIR, '..', '..', 'packages', replacement)
          )
          .replace(/\\/g, '/') // Convert Windows paths to forward slashes
          .replace(/^[.][.]\//, ''); // Remove leading ../ if present
          
          updated = true;
          changes.push(`  - ${match} → ${prefix}${newPath}${quote} (${description})`);
          return `${prefix}${newPath}${quote}`;
        });

        if (newContent !== content) {
          content = newContent;
        }
      }
    }

    // Write the updated content back to the file if changes were made
    if (updated) {
      await fs.promises.writeFile(filePath, content, 'utf-8');
      console.log(chalk.green(`\nUpdated imports in: ${path.relative(process.cwd(), filePath)}`));
      changes.forEach(change => console.log(change));
      return true;
    }
    return false;
  } catch (error) {
    console.error(chalk.red(`Error processing file ${filePath}:`), error);
    return false;
  }
}

// Main function to process all files
async function main() {
  console.log(chalk.blue('Starting import path updates...'));
  
  // Find all TypeScript/JavaScript files
  const files = await glob(FILE_PATTERNS, { 
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

  console.log(chalk.green(`\n✅ Update complete!`));
  console.log(`- Processed ${files.length} files`);
  console.log(`- Updated ${updatedCount} files`);
  
  if (updatedCount > 0) {
    console.log('\nNext steps:');
    console.log('1. Review the changes using git diff');
    console.log('2. Run tests to ensure everything still works');
    console.log('3. Commit the changes');
  } else {
    console.log('No files needed updating.');
  }
}

// Run the script
main().catch(console.error);
