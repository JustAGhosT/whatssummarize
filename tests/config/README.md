# Test Configuration

This directory contains test configuration files and overrides for different testing frameworks.

## Directory Structure

- `jest/`: Jest-specific configuration overrides
- `playwright/`: Playwright-specific configuration overrides

## Usage

These configurations are automatically loaded by the respective testing frameworks. They extend the base configurations defined in the project root.

### Jest

Jest will automatically look for configuration in:
- `tests/config/jest/jest.config.js`
- `tests/config/jest/jest.setup.js`

### Playwright

Playwright configuration can be extended from:
- `tests/config/playwright/playwright.config.js`

## Adding New Configurations

1. Create a new configuration file in the appropriate subdirectory
2. Ensure it extends the base configuration
3. Document any custom settings in this README
