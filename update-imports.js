const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the root directory
const rootDir = process.cwd();

// Define the directories to search
const searchDirs = [
  'apps/web/src',
  'apps/api/src',
  'packages'
].map(dir => path.join(rootDir, dir));

// File extensions to process
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// Import mappings
const importMappings = [
  { pattern: '@/components/', replacement: '@ui/', description: 'UI components' },
  { pattern: '@/lib/', replacement: '@utils/', description: 'Utility functions' },
  { pattern: '@/config/', replacement: '@config/', description: 'Configuration' }
];

// Function to update imports in a file
function updateImportsInFile(filePath) {
  try {
    // Skip node_modules and other ignored directories
    if (filePath.includes('node_modules') || 
        filePath.includes('.next') || 
        filePath.includes('dist') || 
        filePath.includes('build')) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    const changes = [];

    for (const { pattern, replacement, description } of importMappings) {
      if (content.includes(pattern)) {
        const newContent = content.split(pattern).join(replacement);
        if (newContent !== content) {
          updated = true;
          changes.push(`  - ${pattern} → ${replacement} (${description})`);
          content = newContent;
        }
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(rootDir, filePath);
      console.log(`\x1b[32m✓\x1b[0m Updated imports in ${relativePath}`);
      changes.forEach(change => console.log(change));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Find all files with the given extensions
function findFiles(dirs, extensions) {
  const files = [];
  
  function walk(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // Skip ignored directories
        if (['node_modules', '.next', 'dist', 'build'].includes(item.name)) {
          continue;
        }
        walk(fullPath);
      } else if (extensions.includes(path.extname(item.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }
  
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      walk(dir);
    } else {
      console.log(`Skipping non-existent directory: ${dir}`);
    }
  }
  
  return files;
}

// Main function
function main() {
  console.log('Starting import path updates...');
  
  const files = findFiles(searchDirs, fileExtensions);
  console.log(`Found ${files.length} files to process...`);
  
  let updatedCount = 0;
  for (const file of files) {
    if (updateImportsInFile(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n✅ Successfully updated imports in ${updatedCount} of ${files.length} files`);
  
  if (updatedCount > 0) {
    console.log('\n⚠️  Please review the changes and run your tests to ensure everything works correctly.');
  } else {
    console.log('\nNo import updates were needed.');
  }
}

// Run the script
main();
