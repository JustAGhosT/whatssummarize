const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Default configuration
const config = {
  outputDir: path.join('tests', '__results__'),
  ci: false
};

// Parse command line arguments
process.argv.forEach((arg, index) => {
  if (arg === '--output' && process.argv[index + 1]) {
    config.outputDir = process.argv[index + 1];
  } else if (arg === '--ci') {
    config.ci = true;
  }
});

// Ensure output directory exists
const resultsDir = path.resolve(process.cwd(), config.outputDir);
const junitDir = path.join(resultsDir, 'junit');
const coverageDir = path.join(resultsDir, 'coverage');

[resultsDir, junitDir, coverageDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set environment variables for test output
process.env.JEST_JUNIT_OUTPUT_DIR = junitDir;
process.env.COVERAGE_DIR = coverageDir;

// Test configuration
const TEST_CONFIG = {
  unit: {
    command: 'npm',
    args: ['run', 'test:unit', '--', '--config=jest.config.js', '--passWithNoTests'],
    description: 'Unit Tests',
    color: 'blue',
    outputFile: path.join(junitDir, 'junit.xml')
  },
  components: {
    command: 'npm',
    args: ['run', 'test:components', '--', '--config=jest.config.js', '--passWithNoTests'],
    description: 'Component Tests',
    color: 'cyan',
    outputFile: path.join(junitDir, 'components-junit.xml')
  },
  integration: {
    command: 'npm',
    args: ['run', 'test:integration', '--', '--config=jest.config.js', '--passWithNoTests'],
    description: 'Integration Tests',
    color: 'magenta',
    outputFile: path.join(junitDir, 'integration-junit.xml')
  },
  e2e: {
    command: 'npm',
    args: ['run', 'test:e2e', '--', '--config=tests/__config__/playwright/playwright.config.js'],
    description: 'End-to-End Tests',
    color: 'yellow',
    needsServer: true
  },
  coverage: {
    command: 'npm',
    args: ['run', 'test:coverage', '--', '--config=jest.config.js'],
    description: 'Test Coverage',
    color: 'green'
  }
};

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
    async function runTest(testName, testConfig) {
      console.log(`\n🚀 Running ${chalk.blue(testConfig.description)}...`);
      
      const startTime = Date.now();
      
      return new Promise((resolve) => {
        try {
          const testProcess = exec(
            `${testConfig.command} ${testConfig.args.join(' ')}`,
            { 
              cwd: process.cwd(), 
              maxBuffer: 1024 * 1024 * 10,
              env: {
                ...process.env,
                JEST_JUNIT_OUTPUT_DIR: path.join(process.cwd(), 'tests', '__results__', 'junit')
              }
            },
            (error, stdout, stderr) => {
              const duration = ((Date.now() - startTime) / 1000).toFixed(2);
              
              if (error) {
                console.error(chalk.red(`❌ ${testConfig.description} failed after ${duration}s`));
                if (stderr) console.error(chalk.red(stderr));
                if (stdout) console.log(stdout);
                resolve({ 
                  name: testName, 
                  success: false, 
                  duration, 
                  error: error.message || 'Unknown error',
                  stdout,
                  stderr
                });
              } else {
                console.log(chalk.green(`✅ ${testConfig.description} passed in ${duration}s`));
                if (stdout) console.log(stdout);
                if (stderr) console.error(chalk.yellow(stderr));
                resolve({ 
                  name: testName, 
                  success: true, 
                  duration,
                  stdout,
                  stderr
                });
              }
            }
          );
          
          if (testProcess.stdout) testProcess.stdout.pipe(process.stdout);
          if (testProcess.stderr) testProcess.stderr.pipe(process.stderr);
          
          testProcess.on('error', (error) => {
            console.error(chalk.red(`❌ Error running ${testConfig.description}: ${error.message}`));
            resolve({ 
              name: testName, 
              success: false, 
              duration: ((Date.now() - startTime) / 1000).toFixed(2),
              error: error.message,
              stdout: '',
              stderr: error.stack || error.message
            });
          });
          
        } catch (error) {
          console.error(chalk.red(`❌ Unhandled error in ${testConfig.description}: ${error.message}`));
          resolve({
            name: testName,
            success: false,
            duration: ((Date.now() - startTime) / 1000).toFixed(2),
            error: error.message,
            stdout: '',
            stderr: error.stack || error.message
          });
        }
      });
    };

    // Run a single test command
    runTest('test', { command: 'npm', args: ['run', 'test'] })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
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
  try {
    console.log(`\n${colors.magenta}🚀 Starting test suite...${colors.reset}\n`);
    console.log(`${colors.blue}Output directory: ${resultsDir}${colors.reset}\n`);
    
    const results = {};
    const testTypes = Object.keys(TEST_CONFIG);
    
    for (const type of testTypes) {
      const testConfig = TEST_CONFIG[type];
      console.log(`\n${colors.yellow}=== ${testConfig.description} ===${colors.reset}\n`);
      
      try {
        const command = [testConfig.command, ...testConfig.args].join(' ');
        const { stdout, stderr, duration } = await runCommand(command);
        
        results[type] = { 
          success: true, 
          duration: parseFloat(duration),
          stdout,
          stderr
        };
        
        console.log(`\n${colors.green}✓ ${testConfig.description} passed in ${duration}s${colors.reset}`);
      } catch (error) {
        console.error(`\n${colors.red}✖ ${testConfig.description} failed after ${error.duration || '?'}s${colors.reset}`);
        results[type] = { 
          success: false, 
          error: error.error || error,
          duration: error.duration ? parseFloat(error.duration) : 0,
          stdout: error.stdout,
          stderr: error.stderr
        };
        
        if (config.ci) {
          console.error(`${colors.red}❌ Failing fast due to error in ${type} tests (CI mode)${colors.reset}`);
          generateReport(results);
          process.exit(1);
        }
      }
    }
  } catch (error) {
    console.error(`\n${colors.red}✖ An unexpected error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
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
