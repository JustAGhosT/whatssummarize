#!/bin/bash

echo "Setting up MCP for Mystira.App..."

# Install MCP dependencies
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-github

# Set up environment variables
echo "GITHUB_TOKEN=${GITHUB_TOKEN}" >> .env
echo "AZURE_CONNECTION_STRING=${AZURE_CONNECTION_STRING}" >> .env

# Verify setup
npx @modelcontextprotocol/server-filesystem --version
npx @modelcontextprotocol/server-github --version

echo "MCP setup complete!"
echo "Configuration file: .github/mcp.json"
echo "Instructions: .github/copilot-instructions.md"