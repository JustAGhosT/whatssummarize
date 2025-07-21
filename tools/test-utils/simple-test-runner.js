const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Configuration
const config = {
  outputDir: path.join('tests', '__results__'),
  ci: process.argv.includes('--ci')
};

// Parse command line arguments
process.argv.forEach((arg, i) => {
  if (arg === '--output' && process.argv[i + 1]) {
    config.outputDir = process.argv[i + 1];
  }
});

// Ensure output directories exist
const resultsDir = path.resolve(process.cwd(), config.outputDir);
const junitDir = path.join(resultsDir, 'junit');
const coverageDir = path.join(resultsDir, 'coverage');

[resultsDir, junitDir, coverageDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Test configuration
const TEST_CONFIG = [
  { 
    name: 'unit', 
    command: 'test:unit', 
    description: 'Unit Tests',
    color: 'blue'
  },
  { 
    name: 'components', 
    command: 'test:components', 
    description: 'Component Tests',
    color: 'cyan'
  },
  { 
    name: 'integration', 
    command: 'test:integration', 
    description: 'Integration Tests',
    color: 'magenta'
  },
  { 
    name: 'e2e', 
    command: 'test:e2e', 
    description: 'End-to-End Tests', 
    needsServer: true,
    color: 'yellow'
  },
  { 
    name: 'coverage', 
    command: 'test:coverage', 
    description: 'Test Coverage',
    color: 'green'
  }
];

// Run a single test command
async function runTest(test) {
  const testHeader = `${chalk[test.color].bold(`[${test.name.toUpperCase()}]`)}`;
  console.log(`\n${testHeader} ${chalk.bold('Running:')} ${test.description}...`);
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testProcess = exec(
      `npm run ${test.command} -- --ci --passWithNoTests`,
      {
        env: { 
          ...process.env,
          JEST_JUNIT_OUTPUT_DIR: junitDir,
          COVERAGE_DIR: coverageDir,
          FORCE_COLOR: '1' // Ensure colors in output
        },
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        cwd: process.cwd()
      },
      (error, stdout, stderr) => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        if (error) {
          console.error(`\n${testHeader} ${chalk.red.bold('✖ Failed')} after ${duration}s`);
          if (stderr) console.error(chalk.red(stderr));
          if (stdout) console.log(stdout);
          resolve({ ...test, success: false, duration, error });
        } else {
          console.log(`\n${testHeader} ${chalk.green.bold('✓ Passed')} in ${duration}s`);
          if (stderr) console.error(chalk.yellow(stderr));
          resolve({ ...test, success: true, duration });
        }
      }
    );

    // Forward output with test prefix
    testProcess.stdout?.on('data', (data) => {
      process.stdout.write(`${testHeader} ${data}`);
    });
    
    testProcess.stderr?.on('data', (data) => {
      process.stderr.write(`${testHeader} ${chalk.red(data)}`);
    });
  });
}

// Main function
async function runTests() {
  console.log(chalk.blue.bold('🚀 Starting test suite...'));
  console.log(`🔧 Output directory: ${chalk.cyan(resultsDir)}`);
  console.log(`⚙️  CI Mode: ${config.ci ? chalk.green('Enabled') : chalk.yellow('Disabled')}`);

  const results = [];
  let hasErrors = false;
  const startTime = Date.now();

  try {
    for (const test of TEST_CONFIG) {
      const result = await runTest(test);
      results.push(result);
      
      if (!result.success) {
        hasErrors = true;
        if (config.ci) {
          console.log(chalk.red.bold('\n⚠️  CI mode: Stopping on first failure'));
          break;
        }
      }
    }

    // Calculate total duration
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    const passedCount = results.filter(r => r.success).length;
    const failedCount = results.length - passedCount;

    // Print summary
    console.log('\n' + chalk.underline.bold('📊 Test Summary:'));
    console.log(`  Total: ${chalk.bold(results.length)}`);
    console.log(`  ${chalk.green('✓ Passed:')} ${chalk.green.bold(passedCount)}`);
    console.log(`  ${chalk.red('✖ Failed:')} ${chalk.red.bold(failedCount)}`);
    console.log(`  ⏱️  Duration: ${totalDuration}s`);

    // Print detailed results
    console.log('\n' + chalk.underline.bold('📝 Detailed Results:'));
    results.forEach(test => {
      const status = test.success 
        ? chalk.green.bold('PASSED') 
        : chalk.red.bold('FAILED');
      console.log(`  ${chalk[test.color].bold(`[${test.name.toUpperCase()}]`)} ${status} - ${test.description} (${test.duration}s)`);
    });

    // Exit with appropriate code
    if (hasErrors) {
      console.error(chalk.red.bold('\n❌ Some tests failed!'));
      process.exit(1);
    } else {
      console.log(chalk.green.bold('\n✅ All tests passed successfully!'));
      process.exit(0);
    }
  } catch (error) {
    console.error(chalk.red.bold('\n⚠️  Error running tests:'));
    console.error(error);
    process.exit(1);
  }

  // Exit with appropriate code
  process.exit(hasErrors ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red('\n⚠️  Unhandled error in test runner:'));
  console.error(error);
  process.exit(1);
});
