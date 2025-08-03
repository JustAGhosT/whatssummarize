const fs = require('fs').promises;
const path = require('path');
const { globby } = require('globby');

// Get the current directory name in CommonJS
const __filename = __filename;
const __dirname = path.dirname(__filename);

// Configuration
const ROOT_DIR = path.join(__dirname, '../../');
const TARGET_DIRS = [
  'apps/web/src',
  'apps/api/src',
  'packages'
].map(dir => path.join(ROOT_DIR, dir));

const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Import mappings
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
  }
];

// Find all files with the specified extensions
async function findFiles(dir, extensions) {
  const patterns = extensions.map(ext => `${dir}/**/*${ext}`);
  const ignore = [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**'
  ];
  
  return await globby(patterns, { ignore, absolute: true });
}

// Update imports in a file
async function updateImportsInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let updated = false;
    let changes = [];

    for (const { pattern, replacement, description } of IMPORT_MAPPINGS) {
      // Handle different import/export patterns
      const patterns = [
        // import { x } from '...'
        `(import\\s+\\{[^}]*\\}\\s+from\\s+['\"])${pattern.source}(['\"])`,
        // import x from '...'
        `(import\\s+[^'"\s]+\\s+from\\s+['\"])${pattern.source}(['\"])`,
        // import '...'
        `(import\\s+['\"])${pattern.source}(['\"])`,
        // export { x } from '...'
        `(export\\s+\\{[^}]*\\}\\s+from\\s+['\"])${pattern.source}(['\"])`,
        // export * from '...'
        `(export\\s+\\*\\s+from\\s+['\"])${pattern.source}(['\"])`
      ];

      for (const patternStr of patterns) {
        const regex = new RegExp(patternStr, 'g');
        const newContent = content.replace(regex, (match, prefix, quote) => {
          const newPath = prefix.replace(new RegExp(pattern.source), replacement);
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
          break;
        }
      }
    }

    if (updated) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✓ Updated imports in ${path.relative(ROOT_DIR, filePath)}`);
      changes.forEach(change => console.log(change));
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting import path updates...');
  
  try {
    let totalFiles = 0;
    let updatedCount = 0;

    for (const targetDir of TARGET_DIRS) {
      if (!fs.existsSync(targetDir)) {
        console.log(`Skipping non-existent directory: ${targetDir}`);
        continue;
      }

      console.log(`\nProcessing directory: ${path.relative(ROOT_DIR, targetDir)}`);
      
      const files = await findFiles(targetDir, FILE_EXTENSIONS);
      console.log(`Found ${files.length} files to process...`);
      
      totalFiles += files.length;
      
      for (const file of files) {
        const updated = await updateImportsInFile(file);
        if (updated) updatedCount++;
      }
    }

    console.log(`\n✅ Successfully updated imports in ${updatedCount} of ${totalFiles} files`);
    
    if (updatedCount > 0) {
      console.log('\n⚠️  Please review the changes and run your tests to ensure everything works correctly.');
    } else {
      console.log('\nNo import updates were needed.');
    }
  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
