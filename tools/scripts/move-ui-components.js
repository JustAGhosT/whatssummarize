import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_APP_PATH = path.join(__dirname, '..', '..', 'apps', 'web', 'src');
const UI_PACKAGE_PATH = path.join(__dirname, '..', '..', 'packages', 'ui', 'src');

// Files to move from web app to UI package
const FILES_TO_MOVE = [
  'components/ui/**/*',
  'lib/utils.ts',
  'hooks/use-toast.ts',
  'hooks/use-click-outside.ts',
  'hooks/use-dark-mode.ts'
];

async function copyFile(source, target) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
  console.log(`Copied ${path.relative(process.cwd(), source)} to ${path.relative(process.cwd(), target)}`);
}

async function moveFiles() {
  console.log('Starting to move UI components...');
  
  // Move UI components
  for (const pattern of FILES_TO_MOVE) {
    const sourcePattern = path.join(WEB_APP_PATH, pattern);
    const files = await glob(sourcePattern, { nodir: true });
    
    for (const source of files) {
      const relativePath = path.relative(WEB_APP_PATH, source);
      const target = path.join(UI_PACKAGE_PATH, relativePath);
      
      await copyFile(source, target);
    }
  }
  
  console.log('\n✅ UI components moved successfully!');
  console.log('\nNext steps:');
  console.log('1. Update import paths in the web app');
  console.log('2. Update the UI package\'s package.json');
  console.log('3. Add the UI package as a dependency in the web app\'s package.json');
}

// Run the script
moveFiles().catch(console.error);
