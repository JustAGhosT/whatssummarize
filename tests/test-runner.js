const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

// Helper function to run commands
const runCommand = (command, cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    console.log(`${colors.cyan}Running: ${command}${colors.reset}`);
    const child = exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        return reject(error);
      }
      if (stderr) {
        console.error(stderr);
      }
      console.log(stdout);
      resolve({ stdout, stderr });
    });

    // Forward child process output
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
};

// Export TEST_CONFIG for testing
const TEST_CONFIG = {
  unit: {
    command: 'npm test',
    args: 'tests/unit',
    description: 'Unit Tests'
  },
  components: {
    command: 'npm test',
    args: 'tests/components',
    description: 'Component Tests'
  },
  integration: {
    command: 'npm test',
    args: 'tests/integration',
    description: 'Integration Tests'
  },
  e2e: {
    command: 'npx playwright test',
    args: 'tests/e2e',
    description: 'End-to-End Tests',
    needsServer: true
  },
  performance: {
    command: 'node',
    args: 'tests/performance/runner.js',
    description: 'Performance Tests'
  },
  security: {
    command: 'echo',
    args: 'Security tests not yet implemented',
    description: 'Security Tests'
  }
};

// Main test runner
const runTests = async () => {
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
      await runCommand(`${config.command} ${config.args}`);
    }
    
    // Start the development server for E2E tests
    if (fs.existsSync(path.join(process.cwd(), 'tests', 'e2e'))) {
      console.log(`\n${colors.cyan}=== Starting Development Server ===${colors.reset}`);
      const serverProcess = exec('npm run dev');
      
      // Forward server output to a buffer
      let serverOutput = '';
      serverProcess.stdout.on('data', (data) => {
        serverOutput += data.toString();
      });
      
      serverProcess.stderr.on('data', (data) => {
        serverOutput += data.toString();
        process.stderr.write(data);
      });
      
      // Wait for server to be ready
      console.log('Waiting for server to start... (this may take a moment)');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      try {
        // Run E2E tests
        console.log(`\n${colors.cyan}=== ${TEST_CONFIG.e2e.description} ===${colors.reset}`);
        await runCommand(TEST_CONFIG.e2e.command, process.cwd());
      } finally {
        // Ensure server is killed after tests
        try {
          process.kill(serverProcess.pid, 'SIGTERM');
        } catch (e) {
          console.error('Error stopping server:', e);
        }
      }
    }
    
    console.log(`\n${colors.green}✅ All tests completed successfully!${colors.reset}\n`);
  } catch (error) {
    console.error(`\n${colors.red}❌ Test suite failed: ${error.message}${colors.reset}\n`);
    process.exit(1);
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
