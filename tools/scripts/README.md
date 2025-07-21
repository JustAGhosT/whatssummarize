# Development Scripts

This directory contains various development and maintenance scripts for the project.

## Available Scripts

### Test Data Generator

Generate mock test data for development and testing.

```bash
# Generate test data (default: 10 records)
npx tsx generators/test-data.ts

# Generate a specific number of records
npx tsx generators/test-data.ts --count 20

# Specify output file
npx tsx generators/test-data.ts --output ./path/to/output.json
```

### Test File Organizer

Organize test files into a structured directory layout.

```bash
# Organize test files
npx tsx organize-tests.ts

# Dry run (show what would be done without making changes)
npx tsx organize-tests.ts --dry-run

# Verbose output
npx tsx organize-tests.ts --verbose
```

## Adding New Scripts

1. Create a new TypeScript file in the appropriate directory:
   - `generators/` - For scripts that generate code or test data
   - `utils/` - For utility scripts
   - `setup/` - For setup and configuration scripts

2. Add any new commands to the `bin` field in `package.json` if they should be executable from the command line.

3. Document the script in this README.

## Development

- Use TypeScript for type safety
- Follow the existing code style
- Add appropriate error handling
- Include command-line help with `commander`
- Use `chalk` for colored output
- Use `ora` for spinners and progress indicators
