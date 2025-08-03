#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const commander_1 = require("commander");
const faker_1 = require("@faker-js/faker");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
// Get the directory name in ES module
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
// Parse command line arguments
commander_1.program
    .name('generate-test-data')
    .description('Generate test data for the application')
    .option('-c, --count <number>', 'Number of test records to generate', '10')
    .option('-o, --output <path>', 'Output file path', './tests/mocks/generated-test-data.json')
    .parse(process.argv);
const options = commander_1.program.opts();
const count = parseInt(options.count, 10);
const outputPath = path_1.default.resolve(process.cwd(), options.output);
/**
 * Generate a single test message
 */
function generateMessage() {
    return {
        id: faker_1.faker.string.uuid(),
        sender: faker_1.faker.helpers.arrayElement(['user', 'assistant']),
        content: faker_1.faker.lorem.sentences({ min: 1, max: 3 }),
        timestamp: faker_1.faker.date.recent().toISOString(),
        metadata: {
            isPinned: faker_1.faker.datatype.boolean(),
            reactions: Array.from({ length: faker_1.faker.number.int({ min: 0, max: 3 }) }, () => ({
                emoji: faker_1.faker.internet.emoji(),
                count: faker_1.faker.number.int({ min: 1, max: 10 }),
            })),
        },
    };
}
/**
 * Generate test data
 * @param count Number of messages to generate
 */
async function generateTestData(count) {
    const spinner = (0, ora_1.default)('Generating test data...').start();
    try {
        const data = Array.from({ length: count }, () => generateMessage());
        spinner.succeed(`Successfully generated ${count} test messages`);
        return data;
    }
    catch (error) {
        spinner.fail('Failed to generate test data');
        throw error;
    }
}
/**
 * Save test data to a file
 * @param data Data to save
 * @param outputPath Output file path
 */
async function saveTestData(data, outputPath) {
    const spinner = (0, ora_1.default)('Saving test data...').start();
    try {
        // Ensure output directory exists
        const outputDir = path_1.default.dirname(outputPath);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        // Write the data to file
        await fs_1.default.promises.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
        spinner.succeed(`Test data saved to ${chalk_1.default.cyan(outputPath)}`);
    }
    catch (error) {
        spinner.fail('Failed to save test data');
        throw error;
    }
}
// Main function
async function main() {
    try {
        console.log(chalk_1.default.blue('\n=== Test Data Generator ===\n'));
        // Generate test data
        const data = await generateTestData(count);
        // Save to file
        await saveTestData(data, outputPath);
        console.log(chalk_1.default.green('\nDone!\n'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\nError:'), error);
        process.exit(1);
    }
}
// Run the script
main();
//# sourceMappingURL=test-data.js.map