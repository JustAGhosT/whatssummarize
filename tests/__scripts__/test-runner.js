const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--output <path>', 'Output directory for test results', './tests/__results__')
  .option('--ci', 'Run in CI mode', false);
program.parse(process.argv);

const options = program.opts();

// Ensure output directory exists
const resultsDir = path.resolve(process.cwd(), options.output);
const junitDir = path.join(resultsDir, 'junit');
const coverageDir = path.join(resultsDir, 'coverage');
const playwrightDir = path.join(resultsDir, 'playwright');

[resultsDir, junitDir, coverageDir, playwrightDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Helper function to run commands
const runCommand = (command, cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    console.log(`\n${colors.blue}▶ ${colors.reset}${colors.cyan}${command}${colors.reset}\n`);
    
    const startTime = Date.now();
    const child = exec(command, { cwd, maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      if (error) {
        console.error(`\n${colors.red}✖ Failed after ${duration}s${colors.reset}\n`);
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        return reject({ error, stdout, stderr, duration });
      }
      
      console.log(`\n${colors.green}✓ Completed in ${duration}s${colors.reset}\n`);
      resolve({ stdout, stderr, duration });
    });

    // Forward child process output
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
};

// Test configuration
const TEST_CONFIG = {
  unit: {
    command: 'npm',
    args: ['run', 'test:unit'],
    description: 'Unit Tests',
    outputFile: path.join(junitDir, 'junit.xml')
  },
  components: {
    command: 'npm',
    args: ['run', 'test:components'],
    description: 'Component Tests',
    outputFile: path.join(junitDir, 'components-junit.xml')
  },
  integration: {
    command: 'npm',
    args: ['run', 'test:integration'],
    description: 'Integration Tests',
    outputFile: path.join(junitDir, 'integration-junit.xml')
  },
  e2e: {
    command: 'npx',
    args: ['playwright', 'test', '--config=tests/__config__/playwright/playwright.config.js'],
    description: 'End-to-End Tests',
    needsServer: true
  },
  performance: {
    command: 'node',
    args: ['tests/performance/runner.js'],
    description: 'Performance Tests'
  },
  security: {
    command: 'node',
    args: ['tests/security/runner.js'],
    description: 'Security Tests'
  }
};

// Generate test report
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    duration: Object.values(results).reduce((acc, { duration = 0 }) => acc + duration, 0),
    results: {}
  };

  Object.entries(results).forEach(([type, result]) => {
    report.results[type] = {
      success: result.success,
      duration: result.duration || 0,
      error: result.error ? result.error.message : null
    };
  });

  const reportPath = path.join(resultsDir, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n${colors.blue}📊 Test report saved to: ${reportPath}${colors.reset}`);
  
  return report;
}

// Main test runner
async function runTests() {
  console.log(`\n${colors.magenta}🚀 Starting test suite...${colors.reset}\n`);
  console.log(`${colors.blue}Output directory: ${resultsDir}${colors.reset}\n`);
  
  const results = {};
  const testTypes = Object.keys(TEST_CONFIG);
  
  for (const type of testTypes) {
    const config = TEST_CONFIG[type];
    console.log(`\n${colors.yellow}=== ${config.description} ===${colors.reset}\n`);
    
    try {
      const command = [config.command, ...config.args].join(' ');
      const { stdout, stderr, duration } = await runCommand(command);
      
      results[type] = { 
        success: true, 
        duration: parseFloat(duration),
        stdout,
        stderr
      };
      
      console.log(`\n${colors.green}✓ ${config.description} passed in ${duration}s${colors.reset}`);
    } catch (error) {
      console.error(`\n${colors.red}✖ ${config.description} failed after ${error.duration || '?'}s${colors.reset}`);
      results[type] = { 
        success: false, 
        error: error.error || error,
        duration: error.duration ? parseFloat(error.duration) : 0,
        stdout: error.stdout,
        stderr: error.stderr
      };
      
      if (options.ci) {
        console.error(`${colors.red}❌ Failing fast due to error in ${type} tests (CI mode)${colors.reset}`);
        generateReport(results);
        process.exit(1);
      }
    }
  }
  
  // Generate and save test report
  const report = generateReport(results);
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.blue}📊 Test Suite Summary${colors.reset}`);
  console.log('='.repeat(80));
  
  let allPassed = true;
  Object.entries(results).forEach(([type, result]) => {
    const status = result.success 
      ? `${colors.green}✓ PASSED${colors.reset}` 
      : `${colors.red}✖ FAILED${colors.reset}`;
    const duration = `(${(result.duration || 0).toFixed(2)}s)`;
    console.log(`${type.padEnd(15)} ${status.padEnd(20)} ${duration}`);
    
    if (!result.success) {
      allPassed = false;
      console.error(`   ${colors.red}${result.error.message}${colors.reset}`);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`Total duration: ${(report.duration / 60).toFixed(2)} minutes`);
  console.log('='.repeat(80));
  
  if (!allPassed) {
    console.error(`\n${colors.red}❌ Some tests failed!${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`\n${colors.green}✅ All tests passed!${colors.reset}`);
  console.log(`📊 View detailed reports in: ${colors.cyan}${resultsDir}${colors.reset}\n`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Only run the test suite if this file is being executed directly
if (require.main === module) {
  runTests();
}

// Export for testing
module.exports = {
  runCommand,
  TEST_CONFIG,
  runTests,
  generateReport
};
