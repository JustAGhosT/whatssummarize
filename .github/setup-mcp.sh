#!/bin/bash

echo "Setting up MCP for WhatsApp Conversation Summarizer..."

# Install MCP dependencies using pnpm
pnpm add -g @modelcontextprotocol/server-filesystem
pnpm add -g @modelcontextprotocol/server-github

# Set up environment variables
# Create .env file if it doesn't exist, and update variables without duplicates
if [ ! -f .env ]; then
  touch .env
fi

# Update or add GITHUB_TOKEN
if grep -q "^GITHUB_TOKEN=" .env; then
  sed -i "s|^GITHUB_TOKEN=.*|GITHUB_TOKEN=${GITHUB_TOKEN}|" .env
else
  echo "GITHUB_TOKEN=${GITHUB_TOKEN}" >> .env
fi

# Verify setup
pnpm exec @modelcontextprotocol/server-filesystem --version
pnpm exec @modelcontextprotocol/server-github --version

echo "MCP setup complete!"
echo "Configuration file: .github/mcp.json"
echo "Instructions: .github/copilot-instructions.md"