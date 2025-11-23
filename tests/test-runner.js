const { spawn } = require('child_process');
const path = require('path');
const fs = require('node:fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

// Helper function to run commands using spawn for better security
const runCommand = (command, args = [], cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    console.log(`${colors.cyan}Running: ${command} ${args.join(' ')}${colors.reset}`);
    const child = spawn(command, args, { cwd, shell: process.platform === 'win32' });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      process.stdout.write(data);
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`${colors.red}Error: Command exited with code ${code}${colors.reset}`);
        return reject(new Error(`Command exited with code ${code}`));
      }
      resolve({ stdout, stderr });
    });

    child.on('error', (error) => {
      console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
      reject(error);
    });
  });
};

// Export TEST_CONFIG for testing
const TEST_CONFIG = {
  unit: {
    command: 'npm',
    args: ['test', 'tests/unit'],
    description: 'Unit Tests'
  },
  components: {
    command: 'npm',
    args: ['test', 'tests/components'],
    description: 'Component Tests'
  },
  integration: {
    command: 'npm',
    args: ['test', 'tests/integration'],
    description: 'Integration Tests'
  },
  e2e: {
    command: 'npx',
    args: ['playwright', 'test', 'tests/e2e'],
    description: 'End-to-End Tests',
    needsServer: true
  },
  performance: {
    command: 'node',
    args: ['tests/performance/runner.js'],
    description: 'Performance Tests'
  },
  security: {
    command: 'echo',
    args: ['Security tests not yet implemented'],
    description: 'Security Tests'
  }
};

// Main test runner
const runTests = async () => {
  let serverProcess;
  try {
    console.log(`\n${colors.blue}🚀 Starting Test Suite${colors.reset}`);
    console.log(`${colors.blue}========================${colors.reset}\n`);

    // Run all test types except e2e first
    for (const [testType, config] of Object.entries(TEST_CONFIG)) {
      if (testType === 'e2e') continue; // Will run e2e tests after server starts

      const testPath = path.join(process.cwd(), 'tests', testType);
      if (!fs.existsSync(testPath)) {
        console.log(`${colors.yellow}⚠️  ${config.description} directory not found, skipping...${colors.reset}\n`);
        continue;
      }

      console.log(`\n${colors.cyan}=== ${config.description} ===${colors.reset}`);
      await runCommand(config.command, config.args);
    }

    // Start the development server for E2E tests
    if (fs.existsSync(path.join(process.cwd(), 'tests', 'e2e'))) {
      console.log(`\n${colors.cyan}=== Starting Development Server ===${colors.reset}`);
      serverProcess = spawn('npm', ['run', 'dev'], { detached: true });

      // Forward server output
      serverProcess.stdout.pipe(process.stdout);
      serverProcess.stderr.pipe(process.stderr);

      // Wait for server to be ready
      console.log('Waiting for server to start... (this may take a moment)');
      await new Promise(resolve => setTimeout(resolve, 15000)); // Increased wait time for server

      // Run E2E tests
      console.log(`\n${colors.cyan}=== ${TEST_CONFIG.e2e.description} ===${colors.reset}`);
      await runCommand(TEST_CONFIG.e2e.command, TEST_CONFIG.e2e.args);
    }

    console.log(`\n${colors.green}✅ All tests completed successfully!${colors.reset}\n`);
  } catch (error) {
    console.error(`\n${colors.red}❌ Test suite failed: ${error.message}${colors.reset}\n`);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      console.log('Stopping development server...');
      // Kill the entire process group
      process.kill(-serverProcess.pid, 'SIGTERM');
    }
    process.exit();
  }
};

// Only run the test suite if this file is being executed directly
if (require.main === module) {
  runTests();
}

// Export for testing
module.exports = {
  runCommand,
  TEST_CONFIG,
  runTests
};
