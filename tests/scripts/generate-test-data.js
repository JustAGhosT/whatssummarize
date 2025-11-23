#!/usr/bin/env node
/**
 * Script to generate test data for the test suite.
 * 
 * Usage:
 *   node tests/scripts/generate-test-data.js [options]
 * 
 * Options:
 *   --count=<number>  Number of test records to generate (default: 10)
 *   --output=<path>   Output file path (default: tests/mocks/generated-test-data.json)
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { faker } = require('@faker-js/faker');

// Parse command line arguments
program
  .option('--count <number>', 'Number of test records to generate', '10')
  .option('--output <path>', 'Output file path', './tests/mocks/generated-test-data.json')
  .parse(process.argv);

const options = program.opts();
const count = parseInt(options.count, 10);
const outputPath = path.resolve(process.cwd(), options.output);

/**
 * Generate a single test message
 * @returns {object} Generated message object
 */
function generateMessage() {
  return {
    id: faker.string.uuid(),
    sender: faker.helpers.arrayElement(['user', 'assistant']),
    content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    timestamp: faker.date.recent().toISOString(),
    metadata: {
      isPinned: faker.datatype.boolean(),
      reactions: Array.from({ length: faker.number.int(3) }, () => ({
        emoji: faker.internet.emoji(),
        count: faker.number.int(10),
      })),
    },
  };
}

/**
 * Generate test data
 * @param {number} count Number of messages to generate
 * @returns {object} Test data object
 */
function generateTestData(count) {
  return {
    messages: Array.from({ length: count }, generateMessage),
    metadata: {
      generatedAt: new Date().toISOString(),
      count,
    },
  };
}

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate and save test data
const testData = generateTestData(count);
fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2));

console.log(`✅ Generated ${count} test messages at ${outputPath}`);
