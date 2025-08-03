import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

// Define the source directories and file patterns
const SRC_DIRS = [
  path.join(process.cwd(), 'apps/web/src'),
  path.join(process.cwd(), 'apps/api/src'),
  path.join(process.cwd(), 'packages')
];
const FILE_PATTERNS = ['**/*.{ts,tsx,js,jsx}'];
const EXCLUDE_PATTERNS = ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/build/**'];

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
async function updateImportsInFile(filePath: string) {
  try {
    // Skip files in node_modules and other excluded directories
    if (EXCLUDE_PATTERNS.some(pattern => 
      minimatch(filePath, pattern, { matchBase: true })
    )) {
      return false;
    }

    let content = await fs.promises.readFile(filePath, 'utf-8');
    let updated = false;
    let changes: string[] = [];

    // Process each import mapping
    for (const { pattern, replacement, description } of IMPORT_MAPPINGS) {
      // Handle different import styles:
      // 1. import { x } from '@/components/...'
      // 2. import x from '@/components/...'
      // 3. import '@/components/...'
      // 4. export { x } from '@/components/...'
      // 5. export * from '@/components/...'
      const patterns = [
        // Import with destructuring
        `(import\s+\{[^}]*\}\s+from\s+['"])${pattern.source}(['"])`,
        // Default import
        `(import\s+[^'"\s]+\s+from\s+['"])${pattern.source}(['"])`,
        // Import without binding (side effects)
        `(import\s+['"])${pattern.source}(['"])`,
        // Export from
        `(export\s+\{[^}]*\}\s+from\s+['"])${pattern.source}(['"])`,
        // Export all
        `(export\s+\*\s+from\s+['"])${pattern.source}(['"])`
      ];

      for (const patternStr of patterns) {
        const regex = new RegExp(patternStr, 'g');
        
        const newContent = content.replace(regex, (match, prefix, quote) => {
          const newPath = prefix.replace(new RegExp(pattern.source, 'g'), replacement);
          if (newPath !== prefix) {
            updated = true;
            const fromPath = prefix.match(new RegExp(pattern.source))?.[0] || prefix;
            changes.push(`  - ${fromPath} → ${replacement} (${description})`);
            return `${newPath}${quote}`;
          }
          return match;
        });

        if (newContent !== content) {
          content = newContent;
          break; // Move to next mapping after first match
        }
      }
    }

    if (updated) {
      await fs.promises.writeFile(filePath, content, 'utf-8');
      console.log(chalk.green(`✓ Updated imports in ${path.relative(process.cwd(), filePath)}`));
      changes.forEach(change => console.log(`  ${change}`));
      return true;
    }
    return false;
  } catch (error) {
    console.error(chalk.red(`Error processing ${filePath}:`), error);
    return false;
  }
}

// Main function to process all files
async function main() {
  console.log(chalk.blue('Starting import path updates...'));
  
  try {
    let totalFiles = 0;
    let updatedCount = 0;

    // Process each source directory
    for (const srcDir of SRC_DIRS) {
      if (!fs.existsSync(srcDir)) {
        console.log(chalk.yellow(`Skipping non-existent directory: ${srcDir}`));
        continue;
      }

      console.log(chalk.blue(`\nProcessing directory: ${path.relative(process.cwd(), srcDir)}`));
      
      const files = await glob(FILE_PATTERNS, { 
        cwd: srcDir, 
        absolute: true,
        ignore: EXCLUDE_PATTERNS
      });

      console.log(chalk.blue(`Found ${files.length} files to process...`));
      totalFiles += files.length;
      
      for (const file of files) {
        const updated = await updateImportsInFile(file);
        if (updated) updatedCount++;
      }
    }

    console.log(chalk.green(`\n✅ Successfully updated imports in ${updatedCount} of ${totalFiles} files`));
    
    if (updatedCount > 0) {
      console.log(chalk.yellow('\n⚠️  Please review the changes and run your tests to ensure everything works correctly.'));
    } else {
      console.log(chalk.blue('\nNo import updates were needed.'));
    }
  } catch (error) {
    console.error(chalk.red('\nError:'), error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
