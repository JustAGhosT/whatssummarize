const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);

const TEST_ROOT = path.join(__dirname, '..');

// Define the target structure
const TARGET_STRUCTURE = {
  // Config files
  '__config__/jest': [
    'config/jest/*',
  ],
  '__config__/playwright': [
    'config/playwright/*',
  ],
  
  // Scripts and utilities
  '__scripts__/setup': [
    'setup/*',
    'setupTests.ts',
    'test-utils.tsx',
    'test-context.tsx',
    'providers.tsx',
  ],
  
  // Mocks
  '__mocks__': [
    'mocks/*',
  ],
  
  // Fixtures
  '__fixtures__/data': [
    'fixtures/*.json',
  ],
  
  // Test files
  'unit': [
    'unit/*',
  ],
  'integration': [
    'integration/*',
  ],
  'e2e': [
    'e2e/*',
    'landing-page*.spec.ts',
  ],
  'performance': [
    'performance/*',
  ],
  'components': [
    'components/*',
  ],
};

async function ensureDirectoryExists(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function moveWildcardFiles(dir, pattern, fullTargetPath) {
  try {
    const files = await readdir(dir);
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const matchedFiles = files.filter(file => regex.test(file));
    
    for (const file of matchedFiles) {
      const sourceFile = path.join(dir, file);
      const targetFile = path.join(fullTargetPath, file);
      await moveFile(sourceFile, targetFile);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, err);
    }
  }
}

async function moveFile(sourceFile, targetFile) {
  try {
    await rename(sourceFile, targetFile);
    console.log(`Moved: ${sourceFile} -> ${targetFile}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error moving ${sourceFile}:`, err);
    }
  }
}

async function processSingleSource(source, fullTargetPath) {
  const fullSourcePath = path.join(TEST_ROOT, source);
  
  if (source.includes('*')) {
    const dir = path.dirname(fullSourcePath);
    const pattern = path.basename(fullSourcePath);
    await moveWildcardFiles(dir, pattern, fullTargetPath);
  } else {
    const targetFile = path.join(fullTargetPath, path.basename(source));
    await moveFile(fullSourcePath, targetFile);
  }
}

async function moveFiles() {
  for (const [targetDir, sources] of Object.entries(TARGET_STRUCTURE)) {
    const fullTargetPath = path.join(TEST_ROOT, targetDir);
    await ensureDirectoryExists(fullTargetPath);
    
    for (const source of sources) {
      await processSingleSource(source, fullTargetPath);
    }
  }
  
  await removeEmptyDirectories(TEST_ROOT);
  console.log('Test directory organization complete!');
}

async function removeEmptyDirectories(directory) {
  const files = await readdir(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      await removeEmptyDirectories(fullPath);
      
      // Check if directory is empty after processing subdirectories
      const remainingFiles = await readdir(fullPath);
      if (remainingFiles.length === 0) {
        try {
          await fs.promises.rmdir(fullPath);
          console.log(`Removed empty directory: ${fullPath}`);
        } catch (err) {
          console.error(`Error removing directory ${fullPath}:`, err);
        }
      }
    }
  }
}

// Run the script
moveFiles().catch(console.error);
