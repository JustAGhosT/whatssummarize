const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';

console.log('🚀 Starting cleanup process...');

function runCommand(command, options = {}) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.warn(`Command failed: ${command}`, error.message);
    return false;
  }
}

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    console.log(`Removing directory: ${dir}`);
    if (isWindows) {
      runCommand(`rmdir /s /q "${dir}"`);
    } else {
      runCommand(`rm -rf "${dir}"`);
    }
  }
}

// Kill Node.js processes
console.log('\n🛑 Stopping running servers...');
if (isWindows) {
  runCommand('taskkill /F /IM node.exe /T || exit 0');
  runCommand('taskkill /F /IM npm.cmd /T || exit 0');
} else {
  runCommand('pkill -f node || true');
  runCommand('pkill -f npm || true');
}

// Clean up directories
console.log('\n🧹 Cleaning up directories...');
const dirsToClean = [
  'frontend/.next',
  'frontend/node_modules/.vite',
  'frontend/coverage',
  'backend/dist',
  'test-results',
  'playwright-report'
];

dirsToClean.forEach(dir => removeDir(path.resolve(__dirname, '..', dir)));

// Additional Windows-specific cleanup
if (isWindows) {
  console.log('\n🔧 Running Windows-specific cleanup...');
  // Kill any remaining processes using common ports
  const ports = [3000, 3001, 3002, 3003, 3004, 3005, 8080, 8081, 8082, 8083];
  ports.forEach(port => {
    try {
      const result = execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = result.split('\n');
      lines.forEach(line => {
        const match = line.trim().split(/\s+/);
        const pid = match[match.length - 1];
        if (pid && !isNaN(pid)) {
          console.log(`Killing process using port ${port} (PID: ${pid})`);
          runCommand(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        }
      });
    } catch (e) {
      // No processes found on this port
    }
  });
}

console.log('\n✨ Cleanup completed successfully!');
