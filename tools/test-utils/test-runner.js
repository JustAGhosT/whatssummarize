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
    command: 'npx',
    args: ['jest', '--config=jest.config.js', '--passWithNoTests', '--verbose', '--colors', '--testMatch', '**/tests/unit/**/*.test.{ts,tsx}'],
    description: 'Unit Tests',
    color: 'blue',
    outputFile: path.join(junitDir, 'junit.xml')
  },
  components: {
    command: 'npx',
    args: ['jest', '--config=jest.config.js', '--passWithNoTests', '--verbose', '--colors', '--testMatch', '**/tests/components/**/*.test.{ts,tsx}'],
    description: 'Component Tests',
    color: 'cyan',
    outputFile: path.join(junitDir, 'components-junit.xml')
  },
  integration: {
    command: 'npx',
    args: ['jest', '--config=jest.config.js', '--passWithNoTests', '--verbose', '--colors', '--testMatch', '**/tests/integration/**/*.test.{ts,tsx}'],
    description: 'Integration Tests',
    color: 'magenta',
    outputFile: path.join(junitDir, 'integration-junit.xml')
  },
  e2e: {
    command: 'npx',
    args: ['playwright', 'test', '--config=playwright.config.ts', '--reporter=list,html', '--output=' + resultsDir],
    description: 'End-to-End Tests',
    color: 'green',
    outputFile: path.join(junitDir, 'e2e-results')
  },
  coverage: {
    command: 'npx',
    args: ['jest', '--config=jest.config.js', '--coverage', '--passWithNoTests', '--coverageReporters=json-summary', '--coverageDirectory=' + coverageDir],
    description: 'Test Coverage',
    color: 'yellow',
    outputFile: path.join(coverageDir, 'coverage-summary.json')
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
const runCommand = (command, cwd = process.cwd(), testConfig = {}) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testName = testConfig.description || 'tests';
    let output = '';
    let errorOutput = '';
    
    console.log(`\n${chalk.blue('➤')} ${chalk.bold(testName)}`);
    
    try {
      const testProcess = exec(
        command,
        { 
          cwd: cwd, 
          maxBuffer: 1024 * 1024 * 10,
          env: {
            ...process.env,
            FORCE_COLOR: '1',
            NODE_ENV: 'test',
            JEST_JUNIT_OUTPUT_DIR: path.join(process.cwd(), 'tests', '__results__', 'junit')
          }
        },
        (error, stdout, stderr) => {
          const duration = ((Date.now() - startTime) / 1000).toFixed(2);
          output = stdout || '';
          errorOutput = stderr || '';
          
          if (error) {
            console.error(chalk.red(`✖ ${testName} failed after ${duration}s`));
            if (errorOutput) {
              console.error(chalk.red('Error Output:'));
              console.error(chalk.red(errorOutput));
            }
            if (output) {
              console.log('Output:');
              console.log(output);
            }
            resolve({ 
              name: testName, 
              success: false, 
              duration: parseFloat(duration), 
              error: error.message || 'Test failed',
              stdout: output,
              stderr: errorOutput
            });
          } else {
            console.log(chalk.green(`✓ ${testName} passed in ${duration}s`));
            if (errorOutput) {
              console.log(chalk.yellow('Test output:'));
              console.log(chalk.yellow(errorOutput));
            }
            resolve({
              name: testName,
              success: true,
              duration: parseFloat(duration),
              stdout: output,
              stderr: errorOutput
            });
          }
        }
      );

      // Handle process stdout/stderr streams
      if (testProcess.stdout) {
        testProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
      }
      
      if (testProcess.stderr) {
        testProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
      }

      // Handle process exit
      testProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          console.error(chalk.red(`✖ ${testName} process exited with code ${code}`));
        }
      });
      
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      const errorMsg = error.stack || error.message || 'Unknown error';
      console.error(chalk.red(`✖ Unhandled error in ${testName}:`));
      console.error(chalk.red(errorMsg));
      
      resolve({
        name: testName,
        success: false,
        duration: parseFloat(duration),
        error: errorMsg,
        stdout: output,
        stderr: errorOutput || errorMsg
      });
    }
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
  const results = {}; // Initialize results object
  
  try {
    console.log(`\n${colors.magenta}🚀 Starting test suite...${colors.reset}\n`);
    console.log(`${colors.blue}Output directory: ${resultsDir}${colors.reset}\n`);
    
    const testTypes = Object.keys(TEST_CONFIG);
    
    for (const type of testTypes) {
      const testConfig = TEST_CONFIG[type];
      console.log(`\n${colors.yellow}=== ${testConfig.description} ===${colors.reset}\n`);
      
      try {
        const command = [testConfig.command, ...testConfig.args].join(' ');
        const result = await runCommand(command, process.cwd(), testConfig);
        
        results[type] = { 
          success: result.success, 
          duration: result.duration || 0,
          stdout: result.stdout,
          stderr: result.stderr,
          error: result.error
        };
        
        console.log(`\n${colors.green}✓ ${testConfig.description} passed in ${result.duration}s${colors.reset}`);
      } catch (error) {
        console.error(`\n${colors.red}✖ ${testConfig.description} failed after ${error.duration || '?'}s${colors.reset}`);
        results[type] = { 
          success: false, 
          error: error.error || error,
          duration: error.duration ? parseFloat(error.duration) : 0,
          stdout: error.stdout || '',
          stderr: error.stderr || error.message || 'Unknown error'
        };
        
        if (config.ci) {
          console.error(`${colors.red}❌ Failing fast due to error in ${type} tests (CI mode)${colors.reset}`);
          generateReport(results);
          process.exit(1);
        }
      }
    }
    
    // Generate report after all tests are done
    generateReport(results);
    
    // Check if any tests failed
    const failedTests = Object.values(results).filter(r => !r.success);
    if (failedTests.length > 0) {
      console.error(`\n${colors.red}❌ ${failedTests.length} test suite(s) failed!${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`\n${colors.green}✅ All test suites passed!${colors.reset}`);
    process.exit(0);
  } catch (error) {
    console.error(`\n${colors.red}✖ An unexpected error occurred: ${error.message}${colors.reset}`);
    console.error(error.stack);
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
