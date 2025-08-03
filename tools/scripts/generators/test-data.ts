#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import ora from 'ora';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
program
  .name('generate-test-data')
  .description('Generate test data for the application')
  .option('-c, --count <number>', 'Number of test records to generate', '10')
  .option('-o, --output <path>', 'Output file path', './tests/mocks/generated-test-data.json')
  .parse(process.argv);

const options = program.opts();
const count = parseInt(options.count, 10);
const outputPath = path.resolve(process.cwd(), options.output);

interface TestMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata: {
    isPinned: boolean;
    reactions: Array<{
      emoji: string;
      count: number;
    }>;
  };
}

/**
 * Generate a single test message
 */
function generateMessage(): TestMessage {
  return {
    id: faker.string.uuid(),
    sender: faker.helpers.arrayElement(['user', 'assistant']),
    content: faker.lorem.sentences({ min: 1, max: 3 }),
    timestamp: faker.date.recent().toISOString(),
    metadata: {
      isPinned: faker.datatype.boolean(),
      reactions: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
        emoji: faker.internet.emoji(),
        count: faker.number.int({ min: 1, max: 10 }),
      })),
    },
  };
}

/**
 * Generate test data
 * @param count Number of messages to generate
 */
async function generateTestData(count: number): Promise<TestMessage[]> {
  const spinner = ora('Generating test data...').start();
  
  try {
    const data = Array.from({ length: count }, () => generateMessage());
    spinner.succeed(`Successfully generated ${count} test messages`);
    return data;
  } catch (error) {
    spinner.fail('Failed to generate test data');
    throw error;
  }
}

/**
 * Save test data to a file
 * @param data Data to save
 * @param outputPath Output file path
 */
async function saveTestData(data: TestMessage[], outputPath: string): Promise<void> {
  const spinner = ora('Saving test data...').start();
  
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the data to file
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    
    spinner.succeed(`Test data saved to ${chalk.cyan(outputPath)}`);
  } catch (error) {
    spinner.fail('Failed to save test data');
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log(chalk.blue('\n=== Test Data Generator ===\n'));
    
    // Generate test data
    const data = await generateTestData(count);
    
    // Save to file
    await saveTestData(data, outputPath);
    
    console.log(chalk.green('\nDone!\n'));
  } catch (error) {
    console.error(chalk.red('\nError:'), error);
    process.exit(1);
  }
}

// Run the script
main();
