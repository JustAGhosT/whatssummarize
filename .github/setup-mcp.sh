#!/bin/bash

echo "Setting up MCP for Mystira.App..."

# Install MCP dependencies
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-github

# Environment variables like GITHUB_TOKEN and AZURE_CONNECTION_STRING should be
# sourced from the environment at runtime, not written to a .env file.
# For example, in a GitHub Actions workflow:
#
# env:
#   GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
#   AZURE_CONNECTION_STRING: ${{ secrets.AZURE_CONNECTION_STRING }}

# Verify setup
npx @modelcontextprotocol/server-filesystem --version
npx @modelcontextprotocol/server-github --version

echo "MCP setup complete!"
echo "Configuration file: .github/mcp.json"
echo "Instructions: .github/copilot-instructions.md"