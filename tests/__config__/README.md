# Test Configuration

This directory contains configuration files for various testing frameworks and tools used in the project.

## Structure

- `jest/` - Configuration files for Jest test runner
- `playwright/` - Configuration for Playwright E2E tests

## Usage

Configuration files in this directory extend the base configurations from the project root. They are automatically picked up by the test runners based on the test type being executed.

## Adding New Configurations

1. Create a new subdirectory for the test framework/tool
2. Add a README.md explaining the purpose and usage
3. Reference the configuration in the appropriate npm scripts in `package.json`
